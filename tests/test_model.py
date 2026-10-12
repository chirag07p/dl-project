import unittest
import torch
import numpy as np

from models.dkt_lstm import DKT_LSTM
from models.knowledge_profile import KnowledgeProfiler, StudentKnowledgeProfile, TopicMastery
from models.weakness_detector import WeaknessDetector
from models.forgetting_detector import ForgettingDetector
from models.learning_style import LearningStyleDetector
from recommendation.recommender import PersonalizedRecommender
from engine import PersonalizedAIEngine


class TestPersonalizedAILearning(unittest.TestCase):

    def setUp(self):
        self.num_concepts = 6
        self.model = DKT_LSTM(
            num_concepts=self.num_concepts,
            concept_embed_dim=16,
            correctness_embed_dim=8,
            continuous_feature_dim=8,
            hidden_dim=32,
            num_layers=1,
            dropout=0.0,
        )

    def test_dkt_forward_and_loss(self):
        B, L = 4, 10
        c_seq = torch.randint(0, self.num_concepts, (B, L))
        y_seq = torch.randint(0, 2, (B, L))
        t_seq = torch.rand(B, L) * 400.0 + 60.0
        a_seq = torch.randint(1, 4, (B, L)).float()
        e_seq = torch.rand(B, L) * 5.0

        logits, (hn, cn) = self.model(c_seq, y_seq, t_seq, a_seq, e_seq)
        self.assertEqual(logits.shape, (B, L, self.num_concepts))
        self.assertEqual(hn.shape, (1, B, 32))

        # Test loss computation
        target_c = c_seq[:, 1:]
        target_y = y_seq[:, 1:]
        logits_pred = logits[:, :-1]
        loss = self.model.compute_loss(logits_pred, target_c, target_y)
        self.assertTrue(torch.isfinite(loss))

        # Test backprop
        loss.backward()
        for p in self.model.parameters():
            if p.requires_grad and p.grad is not None:
                self.assertFalse(torch.isnan(p.grad).any())

    def test_knowledge_profiler(self):
        topic_to_idx = {f"top_{i}": i for i in range(self.num_concepts)}
        idx_to_topic = {i: f"top_{i}" for i in range(self.num_concepts)}
        topic_names = {f"top_{i}": f"Topic {i}" for i in range(self.num_concepts)}

        profiler = KnowledgeProfiler(
            model=self.model,
            topic_to_idx=topic_to_idx,
            idx_to_topic=idx_to_topic,
            topic_names=topic_names,
        )

        interactions = [
            {"topic_id": "top_0", "correct": 1, "time_taken": 200, "attempts": 1, "day": 1.0},
            {"topic_id": "top_0", "correct": 1, "time_taken": 180, "attempts": 1, "day": 1.5},
            {"topic_id": "top_1", "correct": 0, "time_taken": 500, "attempts": 4, "day": 2.0},
        ]

        profile = profiler.compute_profile("test_student", interactions, current_day=2.0)
        self.assertIn("top_0", profile.topic_masteries)
        self.assertIn("top_1", profile.topic_masteries)
        self.assertGreater(profile.topic_masteries["top_0"].mastery_score, 0.0)
        self.assertEqual(profile.total_questions_solved, 3)

    def test_weakness_detector(self):
        prereqs = {"top_1": ["top_0"]}
        detector = WeaknessDetector(prerequisite_graph=prereqs)

        # Mock profile where top_1 is weak
        tm0 = TopicMastery("top_0", "Top 0", 0.85, "Proficient", "High", 5, 4, 0.8, 200, 1.2, 0.0)
        tm1 = TopicMastery("top_1", "Top 1", 0.30, "Novice", "Medium", 3, 0, 0.0, 600, 3.5, 0.0)
        profile = StudentKnowledgeProfile(
            student_id="s1",
            topic_masteries={"top_0": tm0, "top_1": tm1},
            overall_mastery=0.55,
            total_questions_solved=8,
            total_correct=4,
            overall_accuracy=0.5,
        )

        alerts = detector.detect(profile)
        self.assertTrue(any(a.topic_id == "top_1" for a in alerts))
        weak_top1 = next(a for a in alerts if a.topic_id == "top_1")
        self.assertEqual(weak_top1.severity, "CRITICAL")

    def test_forgetting_detector(self):
        detector = ForgettingDetector()
        tm = TopicMastery(
            topic_id="arrays_strings",
            topic_name="Arrays",
            mastery_score=0.80,
            mastery_level="Proficient",
            confidence="High",
            question_count=4,
            correct_count=3,
            accuracy_rate=0.75,
            avg_time_sec=250,
            avg_attempts=1.2,
            last_practiced_days_ago=25.0,  # 25 days ago
        )
        profile = StudentKnowledgeProfile(
            student_id="s1",
            topic_masteries={"arrays_strings": tm},
            overall_mastery=0.8,
            total_questions_solved=4,
            total_correct=3,
            overall_accuracy=0.75,
        )

        alerts = detector.detect(profile)
        self.assertEqual(len(alerts), 1)
        self.assertIn(alerts[0].risk_level, ["HIGH", "MODERATE"])

    def test_learning_style_detector(self):
        detector = LearningStyleDetector()
        # Fast intuitive student
        interactions = [
            {"question_id": "q1", "time_taken": 120, "attempts": 1, "correct": 1},
            {"question_id": "q2", "time_taken": 140, "attempts": 1, "correct": 1},
            {"question_id": "q3", "time_taken": 150, "attempts": 1, "correct": 1},
        ]
        style = detector.detect(interactions)
        self.assertEqual(style.pace_description, "Rapid")
        self.assertEqual(style.attempt_behavior, "High Precision")

    def test_engine_end_to_end(self):
        engine = PersonalizedAIEngine(db_path="data/test_student_store.json")
        sid = "unit_test_student"
        engine.record_interaction(sid, "q_arr_01", correct=1, time_taken_sec=210, attempts=1)
        engine.record_interaction(sid, "q_arr_02", correct=1, time_taken_sec=190, attempts=1)

        result = engine.run_full_pipeline(sid)
        self.assertIn("profile", result)
        self.assertIn("weaknesses", result)
        self.assertIn("forgetting_alerts", result)
        self.assertIn("learning_style", result)
        self.assertIn("recommendation", result)
        self.assertIsNotNone(result["recommendation"].recommended_topic_id)


if __name__ == "__main__":
    unittest.main()
