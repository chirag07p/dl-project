import math
from dataclasses import dataclass
from typing import Dict, List, Optional
from .knowledge_profile import StudentKnowledgeProfile, TopicMastery


@dataclass
class ForgettingAlert:
    topic_id: str
    topic_name: str
    risk_level: str               # HIGH, MODERATE, STABLE
    current_retention_rate: float # 0.0 to 1.0
    effective_mastery: float     # original mastery * retention rate
    days_since_practice: float
    memory_half_life_days: float
    recommended_revision_day: float
    urgency_score: float          # 0.0 to 1.0


class ForgettingDetector:
    """
    Implements cognitive memory retention decay based on Ebbinghaus Forgetting dynamics
    to detect topics at risk of being forgotten due to time elapsed since practice.
    """

    def __init__(
        self,
        base_stability_days: float = 3.5,
        alpha_mastery: float = 2.0,
        beta_repetition: float = 1.2,
        high_risk_retention_threshold: float = 0.65,
        moderate_risk_retention_threshold: float = 0.80,
    ):
        self.base_stability = base_stability_days
        self.alpha_mastery = alpha_mastery
        self.beta_repetition = beta_repetition
        self.high_risk_threshold = high_risk_retention_threshold
        self.mod_risk_threshold = moderate_risk_retention_threshold

    def calculate_stability(self, mastery: float, repetitions: int) -> float:
        """
        Calculates memory stability S (time in days until retention drops to ~37%).
        Higher mastery and more practice repetitions drastically increase stability.
        """
        stability = (
            self.base_stability
            * (1.0 + self.alpha_mastery * mastery)
            * (1.0 + self.beta_repetition * math.sqrt(max(1, repetitions)))
        )
        return max(1.0, stability)

    def calculate_retention(self, delta_days: float, stability: float) -> float:
        """
        Ebbinghaus retention curve: R = exp(-delta_days / stability)
        """
        if delta_days <= 0.0:
            return 1.0
        return math.exp(-delta_days / stability)

    def detect(self, profile: StudentKnowledgeProfile) -> List[ForgettingAlert]:
        """
        Evaluates all practiced topics in the student profile for memory decay.
        """
        alerts: List[ForgettingAlert] = []

        for topic_id, tm in profile.topic_masteries.items():
            # Only evaluate topics that have been practiced at least once
            if tm.question_count == 0 or tm.last_practiced_days_ago is None:
                continue

            delta_days = tm.last_practiced_days_ago
            stability = self.calculate_stability(tm.mastery_score, tm.question_count)
            half_life = stability * math.log(2.0)
            retention = self.calculate_retention(delta_days, stability)
            effective_m = tm.mastery_score * retention

            # Determine risk level
            if retention < self.high_risk_threshold:
                risk_level = "HIGH"
            elif retention < self.mod_risk_threshold:
                risk_level = "MODERATE"
            else:
                risk_level = "STABLE"

            # Urgency score balances how high the mastery once was with how much has decayed
            # (Higher decay on valuable mastered skills demands faster revision)
            urgency = (1.0 - retention) * tm.mastery_score

            # Next recommended revision day (when retention would hit 80%)
            ideal_review_days = -stability * math.log(0.80)

            if risk_level in ("HIGH", "MODERATE"):
                alerts.append(
                    ForgettingAlert(
                        topic_id=topic_id,
                        topic_name=tm.topic_name,
                        risk_level=risk_level,
                        current_retention_rate=round(retention, 3),
                        effective_mastery=round(effective_m, 3),
                        days_since_practice=round(delta_days, 1),
                        memory_half_life_days=round(half_life, 1),
                        recommended_revision_day=round(max(0.0, ideal_review_days), 1),
                        urgency_score=round(urgency, 3),
                    )
                )

        # Sort by highest urgency first
        alerts.sort(key=lambda a: a.urgency_score, reverse=True)
        return alerts
