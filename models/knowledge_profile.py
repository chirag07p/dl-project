from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
import numpy as np
import torch

from .dkt_lstm import DKT_LSTM


@dataclass
class TopicMastery:
    topic_id: str
    topic_name: str
    mastery_score: float         # 0.0 to 1.0
    mastery_level: str           # Novice, Intermediate, Proficient, Mastered
    confidence: str              # Low, Medium, High
    question_count: int
    correct_count: int
    accuracy_rate: float
    avg_time_sec: float
    avg_attempts: float
    last_practiced_days_ago: Optional[float] = None


@dataclass
class StudentKnowledgeProfile:
    student_id: str
    topic_masteries: Dict[str, TopicMastery]
    overall_mastery: float
    total_questions_solved: int
    total_correct: int
    overall_accuracy: float
    latent_vector: Optional[List[float]] = None


class KnowledgeProfiler:
    """
    Computes and manages student topic-wise estimated knowledge profiles
    using the DKT-LSTM deep neural network output combined with empirical tracking.
    """

    def __init__(
        self,
        model: DKT_LSTM,
        topic_to_idx: Dict[str, int],
        idx_to_topic: Dict[int, str],
        topic_names: Dict[str, str],
        device: str = "cpu",
    ):
        self.model = model
        self.topic_to_idx = topic_to_idx
        self.idx_to_topic = idx_to_topic
        self.topic_names = topic_names
        self.device = device
        self.num_concepts = len(topic_to_idx)

    def _determine_mastery_level(self, score: float) -> str:
        if score >= 0.85:
            return "Mastered"
        elif score >= 0.70:
            return "Proficient"
        elif score >= 0.45:
            return "Intermediate"
        else:
            return "Novice"

    def _determine_confidence(self, count: int) -> str:
        if count >= 6:
            return "High"
        elif count >= 2:
            return "Medium"
        else:
            return "Low"

    def compute_profile(
        self,
        student_id: str,
        interactions: List[Dict[str, Any]],
        current_day: float = 0.0,
    ) -> StudentKnowledgeProfile:
        """
        Args:
            student_id: unique identifier of the student
            interactions: list of dicts, each with keys:
                - 'topic_id': str
                - 'correct': int (0 or 1)
                - 'time_taken': float (seconds)
                - 'attempts': int
                - 'day': float (optional, timestamp/day of practice)
            current_day: current day reference for calculating elapsed days
        """
        # Calculate topic-wise empirical statistics
        stats: Dict[str, Dict[str, Any]] = {
            t_id: {
                "count": 0,
                "correct": 0,
                "times": [],
                "attempts": [],
                "last_day": None,
            }
            for t_id in self.topic_to_idx.keys()
        }

        for item in interactions:
            tid = item["topic_id"]
            if tid in stats:
                stats[tid]["count"] += 1
                if item["correct"] == 1:
                    stats[tid]["correct"] += 1
                stats[tid]["times"].append(float(item.get("time_taken", 300.0)))
                stats[tid]["attempts"].append(float(item.get("attempts", 1.0)))
                item_day = float(item.get("day", 0.0))
                stats[tid]["last_day"] = item_day

        # If interactions exist, run the Deep Learning DKT Model forward pass
        predicted_masteries: Dict[str, float] = {}
        latent_repr: Optional[List[float]] = None

        if len(interactions) > 0:
            c_indices = []
            y_vals = []
            t_vals = []
            a_vals = []
            e_vals = []

            last_day_seen = 0.0
            for it in interactions:
                tid = it["topic_id"]
                c_idx = self.topic_to_idx.get(tid, 0)
                c_indices.append(c_idx)
                y_vals.append(int(it.get("correct", 0)))
                t_vals.append(float(it.get("time_taken", 300.0)))
                a_vals.append(float(it.get("attempts", 1.0)))
                
                day = float(it.get("day", last_day_seen))
                elapsed = max(0.0, day - last_day_seen)
                e_vals.append(elapsed)
                last_day_seen = day

            c_t = torch.tensor([c_indices], dtype=torch.long, device=self.device)
            y_t = torch.tensor([y_vals], dtype=torch.long, device=self.device)
            t_t = torch.tensor([t_vals], dtype=torch.float32, device=self.device)
            a_t = torch.tensor([a_vals], dtype=torch.float32, device=self.device)
            e_t = torch.tensor([e_vals], dtype=torch.float32, device=self.device)

            with torch.no_grad():
                self.model.eval()
                logits, (hn, _) = self.model(c_t, y_t, t_t, a_t, e_t)
                last_logits = logits[0, -1, :]
                probs = torch.sigmoid(last_logits).cpu().numpy()
                latent_repr = hn[-1, 0, :].cpu().numpy().tolist()

            for idx, p in enumerate(probs):
                tid = self.idx_to_topic[idx]
                predicted_masteries[tid] = float(p)
        else:
            # Cold start prior: 0.35 default prior mastery for new learners
            for tid in self.topic_to_idx.keys():
                predicted_masteries[tid] = 0.35

        # Fuse model predictions with empirical bayesian smoothing
        topic_masteries: Dict[str, TopicMastery] = {}
        total_questions = len(interactions)
        total_correct = sum(1 for it in interactions if it.get("correct", 0) == 1)

        for tid, s in stats.items():
            model_p = predicted_masteries.get(tid, 0.35)
            cnt = s["count"]
            correct = s["correct"]
            acc = (correct / cnt) if cnt > 0 else 0.0
            avg_t = float(np.mean(s["times"])) if cnt > 0 else 0.0
            avg_a = float(np.mean(s["attempts"])) if cnt > 0 else 0.0

            # Bayesian blend: as count increases, empirical performance grounds the DL prediction
            if cnt == 0:
                final_score = model_p
            else:
                weight_empirical = min(0.65, cnt * 0.15)
                final_score = (1.0 - weight_empirical) * model_p + weight_empirical * acc

            final_score = float(np.clip(final_score, 0.05, 0.99))

            last_practiced_days = None
            if s["last_day"] is not None:
                last_practiced_days = max(0.0, current_day - s["last_day"])

            topic_masteries[tid] = TopicMastery(
                topic_id=tid,
                topic_name=self.topic_names.get(tid, tid),
                mastery_score=round(final_score, 4),
                mastery_level=self._determine_mastery_level(final_score),
                confidence=self._determine_confidence(cnt),
                question_count=cnt,
                correct_count=correct,
                accuracy_rate=round(acc, 3),
                avg_time_sec=round(avg_t, 1),
                avg_attempts=round(avg_a, 2),
                last_practiced_days_ago=last_practiced_days,
            )

        overall_mastery = float(np.mean([tm.mastery_score for tm in topic_masteries.values()]))
        overall_acc = (total_correct / total_questions) if total_questions > 0 else 0.0

        return StudentKnowledgeProfile(
            student_id=student_id,
            topic_masteries=topic_masteries,
            overall_mastery=round(overall_mastery, 4),
            total_questions_solved=total_questions,
            total_correct=total_correct,
            overall_accuracy=round(overall_acc, 3),
            latent_vector=latent_repr,
        )
