from dataclasses import dataclass
from typing import Dict, List, Optional, Any
import numpy as np


@dataclass
class LearningStyleProfile:
    primary_style: str            # e.g., Analytical & Methodical, Fast Intuitive, Trial & Error Explorer, Persistent Striver
    pace_description: str         # Rapid, Moderate, Deliberate
    attempt_behavior: str         # High Precision, Moderate, Trial-and-Error
    time_efficiency_index: float  # < 1.0 is faster than expected, > 1.0 is slower
    persistence_index: float      # Score reflecting retries on tough problems
    pedagogical_guidance: str
    recommended_hint_mode: str    # "Minimal Hints", "Guided Scaffolding", "Edge Case Checks"


class LearningStyleDetector:
    """
    Analyzes telemetry patterns (solving time relative to expected baseline,
    attempt frequency, retry tenacity, and error recovery) to detect
    the student's behavioral learning style.
    """

    def __init__(self, question_meta: Optional[Dict[str, Dict[str, Any]]] = None):
        self.question_meta = question_meta or {}

    def detect(self, interactions: List[Dict[str, Any]]) -> LearningStyleProfile:
        """
        Args:
            interactions: list of interaction events with 'time_taken', 'attempts', 'correct', etc.
        """
        if not interactions:
            return LearningStyleProfile(
                primary_style="Calibrating Learner",
                pace_description="Moderate",
                attempt_behavior="Balanced",
                time_efficiency_index=1.0,
                persistence_index=0.5,
                pedagogical_guidance="Beginning diagnostic phase. Presenting standard balanced practice.",
                recommended_hint_mode="Balanced",
            )

        times_ratio = []
        attempts_list = []
        correctness_list = []

        for item in interactions:
            q_id = item.get("question_id", "")
            time_spent = float(item.get("time_taken", 300.0))
            attempts = float(item.get("attempts", 1.0))
            correct = int(item.get("correct", 1))

            expected_t = 360.0  # default 6 minutes baseline
            if q_id in self.question_meta:
                expected_t = float(self.question_meta[q_id].get("expected_time_sec", 360.0))

            times_ratio.append(time_spent / max(60.0, expected_t))
            attempts_list.append(attempts)
            correctness_list.append(correct)

        avg_time_ratio = float(np.mean(times_ratio))
        avg_attempts = float(np.mean(attempts_list))
        accuracy = float(np.mean(correctness_list))

        # Pace classification
        if avg_time_ratio < 0.80:
            pace_desc = "Rapid"
        elif avg_time_ratio > 1.35:
            pace_desc = "Deliberate"
        else:
            pace_desc = "Moderate"

        # Attempt behavior classification
        if avg_attempts <= 1.4:
            attempt_behavior = "High Precision"
        elif avg_attempts >= 2.6:
            attempt_behavior = "Trial-and-Error"
        else:
            attempt_behavior = "Iterative"

        # Persistence index: accounts for perseverance when questions require multiple tries
        multitry_success = [
            1 for a, c in zip(attempts_list, correctness_list) if a >= 2 and c == 1
        ]
        persistence_score = min(1.0, len(multitry_success) / max(1, len(attempts_list)) * 2.0 + 0.3)

        # Style classification logic
        if avg_attempts <= 1.5 and avg_time_ratio >= 1.15 and accuracy >= 0.70:
            style = "Analytical & Methodical"
            guidance = "You analyze problems carefully and write well-considered solutions with few retries. To build interview speed, try time-boxed problem sprints."
            hint_mode = "Minimal Hints - Concept Pointers Only"

        elif avg_time_ratio <= 0.85 and accuracy >= 0.75 and avg_attempts <= 1.8:
            style = "Fast Intuitive"
            guidance = "You quickly identify algorithmic patterns and execute them with high speed. You are ready for advanced optimizations and Hard-tier edge cases."
            hint_mode = "Edge Case Challenges"

        elif avg_attempts >= 2.4 and avg_time_ratio <= 1.1:
            style = "Trial-and-Error Explorer"
            guidance = "You tend to test code rapidly against judge tests rather than dry-running edge cases first. Practice tracing code on paper before submitting."
            hint_mode = "Pre-submission Edge Case Checks"

        elif avg_time_ratio >= 1.25 and (avg_attempts >= 2.0 or accuracy < 0.65):
            style = "Persistent Striver"
            guidance = "You invest strong effort into tough concepts. We will provide structured breakdown steps and progressive difficulty stepping stones to accelerate mastery."
            hint_mode = "Guided Scaffolding & Subproblem Decompositions"

        else:
            style = "Balanced Adaptive Learner"
            guidance = "You display a well-balanced learning pace. Maintain consistent daily practice with mixed easy and medium questions."
            hint_mode = "Standard Hints"

        return LearningStyleProfile(
            primary_style=style,
            pace_description=pace_desc,
            attempt_behavior=attempt_behavior,
            time_efficiency_index=round(avg_time_ratio, 2),
            persistence_index=round(persistence_score, 2),
            pedagogical_guidance=guidance,
            recommended_hint_mode=hint_mode,
        )
