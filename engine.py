import json
import os
from typing import Dict, List, Optional, Any, Tuple
import torch

from models.dkt_lstm import DKT_LSTM
from models.knowledge_profile import KnowledgeProfiler, StudentKnowledgeProfile
from models.weakness_detector import WeaknessDetector, WeaknessAlert
from models.forgetting_detector import ForgettingDetector, ForgettingAlert
from models.learning_style import LearningStyleDetector, LearningStyleProfile
from recommendation.recommender import PersonalizedRecommender, RecommendationResult


class PersonalizedAIEngine:
    """
    Unified end-to-end engine realizing the full personalized AI learning cycle:
    Student Interaction -> LSTM Deep Knowledge Tracing -> Knowledge Profile
    -> Weakness, Forgetting, & Style Detectors -> Personalized Recommendations.
    """

    def __init__(
        self,
        taxonomy_path: str = "data/dsa_taxonomy.json",
        weights_path: Optional[str] = "weights/dkt_lstm.pt",
        db_path: str = "data/student_store.json",
        psv_dataset_path: str = "data/psv/cognipath_cs_dkt.psv",
        device: str = "cpu",
    ):
        self.device = device
        self.db_path = db_path
        self.taxonomy_path = taxonomy_path
        self.psv_dataset_path = psv_dataset_path

        # Load curriculum ontology
        with open(taxonomy_path, "r", encoding="utf-8") as f:
            self.taxonomy = json.load(f)

        self.topics = [t["id"] for t in self.taxonomy["topics"]]
        self.topic_names = {t["id"]: t["name"] for t in self.taxonomy["topics"]}
        self.topic_to_idx = {tid: i for i, tid in enumerate(self.topics)}
        self.idx_to_topic = {i: tid for i, tid in enumerate(self.topics)}
        self.prerequisites = {
            t["id"]: t.get("prerequisites", []) for t in self.taxonomy["topics"]
        }
        self.questions = self.taxonomy["questions"]
        self.question_lookup = {q["id"]: q for q in self.questions}

        # Load or initialize the PyTorch DKT LSTM model
        if weights_path and os.path.exists(weights_path):
            self.model = DKT_LSTM.load_weights(weights_path, device=self.device)
        else:
            self.model = DKT_LSTM(
                num_concepts=len(self.topics),
                concept_embed_dim=32,
                correctness_embed_dim=16,
                continuous_feature_dim=16,
                hidden_dim=64,
                num_layers=2,
            ).to(self.device)
            self.model.eval()

        # Initialize sub-modules from architecture diagram
        self.profiler = KnowledgeProfiler(
            model=self.model,
            topic_to_idx=self.topic_to_idx,
            idx_to_topic=self.idx_to_topic,
            topic_names=self.topic_names,
            device=self.device,
        )
        self.weakness_detector = WeaknessDetector(
            prerequisite_graph=self.prerequisites,
        )
        self.forgetting_detector = ForgettingDetector()
        self.learning_style_detector = LearningStyleDetector(
            question_meta=self.question_lookup,
        )
        self.recommender = PersonalizedRecommender(
            taxonomy=self.taxonomy,
            questions=self.questions,
            prerequisites=self.prerequisites,
        )

        # In-memory storage for students with persistence
        self.student_store: Dict[str, Dict[str, Any]] = self._load_student_store()

    def _load_student_store(self) -> Dict[str, Dict[str, Any]]:
        if os.path.exists(self.db_path):
            try:
                with open(self.db_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                return {}
        return {}

    def _save_student_store(self):
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        with open(self.db_path, "w", encoding="utf-8") as f:
            json.dump(self.student_store, f, indent=2)

    def get_or_create_student(self, student_id: str, student_name: Optional[str] = None) -> Dict[str, Any]:
        if student_id not in self.student_store:
            self.student_store[student_id] = {
                "student_id": student_id,
                "name": student_name or student_id,
                "interactions": [],
                "current_day": 0.0,
            }
            self._save_student_store()
        return self.student_store[student_id]

    def record_interaction(
        self,
        student_id: str,
        question_id: str,
        correct: int,
        time_taken_sec: float,
        attempts: int = 1,
        days_advanced: float = 0.0,
        sync_to_dataset: bool = True,
    ) -> Dict[str, Any]:
        """
        Records a solved DSA question interaction, advances student timeline,
        and dynamically appends the interaction into the PSV training dataset.
        """
        student = self.get_or_create_student(student_id)
        q = self.question_lookup.get(question_id)
        if not q:
            raise ValueError(f"Question ID '{question_id}' not found in taxonomy.")

        student["current_day"] = round(student.get("current_day", 0.0) + days_advanced, 2)
        current_day = student["current_day"]

        interaction = {
            "question_id": question_id,
            "topic_id": q["topic_id"],
            "correct": int(correct),
            "time_taken": float(time_taken_sec),
            "attempts": int(attempts),
            "day": current_day,
        }

        student["interactions"].append(interaction)
        self._save_student_store()

        # Dynamically append to PSV dataset if enabled
        if sync_to_dataset and self.psv_dataset_path and os.path.exists(self.psv_dataset_path):
            try:
                with open(self.psv_dataset_path, "a", encoding="utf-8") as f:
                    f.write(f"{student_id}|{q['topic_id']}|{int(correct)}|{int(time_taken_sec)}|0|{int(attempts)}\n")
            except Exception as e:
                print(f"[Warning] Could not append to {self.psv_dataset_path}: {e}")

        return interaction

    def retrain_model(self, epochs: int = 5, incremental: bool = True) -> str:
        """
        Dynamically triggers continual learning / fine-tuning on the latest dataset.
        """
        from train import train_model
        weights_path = train_model(
            psv_path=self.psv_dataset_path,
            taxonomy_path=self.taxonomy_path,
            epochs=epochs,
            incremental=incremental,
            device=self.device,
        )
        self.model = DKT_LSTM.load_weights(weights_path, device=self.device)
        self.profiler.model = self.model
        return weights_path

    def run_full_pipeline(self, student_id: str) -> Dict[str, Any]:
        """
        Executes the full pipeline:
        1. Reads interaction history
        2. Deep Learning DKT LSTM forward pass -> Knowledge Profile
        3. Weakness Detection
        4. Forgetting Detection
        5. Learning Style Detection
        6. Personalized Recommendation
        """
        student = self.get_or_create_student(student_id)
        interactions = student.get("interactions", [])
        current_day = float(student.get("current_day", 0.0))

        # 1. Topic-wise estimated knowledge profile (DKT LSTM)
        profile = self.profiler.compute_profile(student_id, interactions, current_day)

        # 2. Weakness Detection
        weaknesses = self.weakness_detector.detect(profile)

        # 3. Forgetting Detection
        forgetting_alerts = self.forgetting_detector.detect(profile)

        # 4. Learning Style Detection
        learning_style = self.learning_style_detector.detect(interactions)

        # 5. Personalized Recommendation
        solved_ids = [it["question_id"] for it in interactions]
        recommendation = self.recommender.recommend(
            profile=profile,
            weaknesses=weaknesses,
            forgetting_alerts=forgetting_alerts,
            style=learning_style,
            solved_question_ids=solved_ids,
        )

        return {
            "student_id": student_id,
            "student_name": student.get("name", student_id),
            "current_day": current_day,
            "profile": profile,
            "weaknesses": weaknesses,
            "forgetting_alerts": forgetting_alerts,
            "learning_style": learning_style,
            "recommendation": recommendation,
        }

    def get_diagnostic_assessment_questions(self, num_per_topic: int = 1) -> List[Dict[str, Any]]:
        """
        Returns a balanced diagnostic questionnaire spanning all curriculum topics
        (Arrays, Strings, Recursion, Trees, Graphs, DP) to assess the student
        across multiple concepts in a single cohesive assessment.
        """
        diagnostic_questions = []
        ordered_topics = sorted(self.taxonomy.get("topics", []), key=lambda t: t.get("order", 0))

        for topic in ordered_topics:
            tid = topic["id"]
            # Find Easy or Medium questions for this topic
            candidates = [q for q in self.questions if q["topic_id"] == tid]
            # Prioritize Easy foundational question first
            easy_qs = [q for q in candidates if q.get("difficulty") == "Easy"]
            med_qs = [q for q in candidates if q.get("difficulty") == "Medium"]
            selected = (easy_qs + med_qs)[:num_per_topic]
            diagnostic_questions.extend(selected)

        return diagnostic_questions

    def record_questionnaire_results(
        self,
        student_id: str,
        answers: List[Dict[str, Any]],
        start_day: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Records a full batch of questionnaire answers across concepts in sequence,
        updating the PyTorch DKT LSTM with the full multi-concept trajectory.
        """
        student = self.get_or_create_student(student_id)
        if start_day is not None:
            student["current_day"] = float(start_day)

        for ans in answers:
            self.record_interaction(
                student_id=student_id,
                question_id=ans["question_id"],
                correct=int(ans["correct"]),
                time_taken_sec=float(ans.get("time_taken_sec", 180.0)),
                attempts=int(ans.get("attempts", 1)),
                days_advanced=float(ans.get("days_advanced", 0.1)),
                sync_to_dataset=True,
            )

        return self.run_full_pipeline(student_id)

    def seed_student_profile_preset(self, student_id: str, preset: str = "student_a") -> Dict[str, Any]:
        """
        Seeds classic student archetype profiles to demonstrate Section 1 of the architecture:
        - student_a: Strong Arrays & Strings (90%), Weak Recursion & Trees (40%) -> Overall ~70%
        - student_b: Weak Arrays & Strings (50%), Strong Recursion & Trees (90%) -> Overall ~70%
        Both achieve similar overall marks, but AI discovers completely opposite learning gaps!
        """
        student = self.get_or_create_student(student_id)
        student["interactions"] = []
        student["current_day"] = 1.0

        if preset == "student_a":
            # Student A: Good at linear data structures, struggles with recursive trees
            interactions_spec = [
                ("q_arr_01", 1, 95.0, 1, 0.2),    # Arrays Easy Correct
                ("q_arr_02", 1, 110.0, 1, 0.2),   # Arrays Easy Correct
                ("q_str_01", 1, 105.0, 1, 0.2),   # Strings Easy Correct
                ("q_str_02", 1, 160.0, 1, 0.2),   # Strings Med Correct
                ("q_rec_01", 0, 240.0, 3, 0.3),   # Recursion Easy Wrong (base case error)
                ("q_rec_02", 0, 320.0, 4, 0.3),   # Recursion Med Wrong
                ("q_tree_01", 0, 260.0, 3, 0.3),  # Tree Easy Wrong
                ("q_dp_01", 0, 300.0, 3, 0.3),    # DP Easy Wrong
            ]
        elif preset == "student_b":
            # Student B: Struggles with two pointers / arrays, but strong in recursion & trees
            interactions_spec = [
                ("q_arr_01", 0, 260.0, 3, 0.2),   # Arrays Wrong
                ("q_arr_02", 0, 240.0, 3, 0.2),   # Arrays Wrong
                ("q_str_01", 0, 220.0, 2, 0.2),   # Strings Wrong
                ("q_str_02", 1, 280.0, 2, 0.2),   # Strings Correct
                ("q_rec_01", 1, 80.0, 1, 0.3),    # Recursion Easy Correct
                ("q_rec_02", 1, 150.0, 1, 0.3),   # Recursion Med Correct
                ("q_tree_01", 1, 90.0, 1, 0.3),   # Tree Easy Correct
                ("q_tree_02", 1, 105.0, 1, 0.3),  # Tree Easy Correct
            ]
        else:
            interactions_spec = [
                ("q_arr_01", 1, 120.0, 1, 0.2),
                ("q_str_01", 1, 140.0, 1, 0.2),
            ]

        for q_id, corr, t_sec, att, d_adv in interactions_spec:
            self.record_interaction(
                student_id=student_id,
                question_id=q_id,
                correct=corr,
                time_taken_sec=t_sec,
                attempts=att,
                days_advanced=d_adv,
                sync_to_dataset=False,
            )

        return self.run_full_pipeline(student_id)

    def explain_weakness_reasons(self, weakness) -> List[str]:
        """
        Feature #5: Explainable Analytics ('Why are you weak?').
        Generates concrete, actionable behavioral insights for why a student is struggling.
        """
        reasons = []
        topic_id = weakness.topic_id

        if weakness.accuracy_rate < 0.50:
            reasons.append(f"Low accuracy ({weakness.accuracy_rate*100:.0f}%): Repeated errors on core concept checks.")

        if weakness.prerequisite_bottlenecks:
            prereq_names = [self.topic_names.get(p, p) for p in weakness.prerequisite_bottlenecks]
            reasons.append(f"Prerequisite gap: Foundational concepts ({', '.join(prereq_names)}) are not yet mastered.")

        if topic_id == "recursion":
            reasons.append("Identified difficulty: Missing terminating base cases or stack overflow misunderstandings.")
        elif topic_id == "dp":
            reasons.append("Identified difficulty: Struggling to identify overlapping subproblems and state recurrence.")
        elif topic_id == "trees":
            reasons.append("Identified difficulty: Unclear tree traversal order (pre/in/post-order DFS mechanics).")
        elif topic_id == "arrays":
            reasons.append("Identified difficulty: Inefficient nested iteration instead of Two Pointers or Hash Maps.")
        elif topic_id == "strings":
            reasons.append("Identified difficulty: Substring boundary off-by-one errors in sliding window tracking.")

        return reasons
