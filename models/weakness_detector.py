from dataclasses import dataclass
from typing import Dict, List, Optional, Any
from .knowledge_profile import StudentKnowledgeProfile, TopicMastery


@dataclass
class WeaknessAlert:
    topic_id: str
    topic_name: str
    severity: str              # CRITICAL, MODERATE, WARNING
    mastery_score: float
    accuracy_rate: float
    reason: str
    suggested_action: str
    prerequisite_bottlenecks: List[str]


class WeaknessDetector:
    """
    Identifies student cognitive weaknesses, struggling concepts,
    high error-rate topics, and prerequisite cascading blockers.
    """

    def __init__(
        self,
        prerequisite_graph: Dict[str, List[str]],
        critical_threshold: float = 0.40,
        moderate_threshold: float = 0.55,
        attempt_struggle_threshold: float = 2.5,
    ):
        self.prerequisites = prerequisite_graph
        self.critical_threshold = critical_threshold
        self.moderate_threshold = moderate_threshold
        self.attempt_struggle_threshold = attempt_struggle_threshold

    def detect(self, profile: StudentKnowledgeProfile) -> List[WeaknessAlert]:
        """
        Scans topic masteries and interaction telemetry to pinpoint vulnerabilities.
        """
        weaknesses: List[WeaknessAlert] = []

        for topic_id, tm in profile.topic_masteries.items():
            # Check prerequisites of this topic that might be weak
            prereqs = self.prerequisites.get(topic_id, [])
            weak_prereqs = [
                p for p in prereqs
                if p in profile.topic_masteries
                and profile.topic_masteries[p].mastery_score < self.moderate_threshold
            ]

            is_weak = False
            severity = "WARNING"
            reasons = []
            suggested_action = ""

            # Case 1: Low mastery after practice
            if tm.question_count >= 1:
                if tm.mastery_score < self.critical_threshold:
                    is_weak = True
                    severity = "CRITICAL"
                    if tm.accuracy_rate < 0.5:
                        reasons.append(
                            f"Mastery ({tm.mastery_score*100:.1f}%) is low with poor accuracy ({tm.accuracy_rate*100:.0f}%)."
                        )
                    else:
                        reasons.append(
                            f"Early stage mastery ({tm.mastery_score*100:.1f}%) requires further consolidation."
                        )
                    suggested_action = "Step back to foundational Easy concepts with guided step-by-step walkthroughs."
                elif tm.mastery_score < self.moderate_threshold:
                    is_weak = True
                    severity = "MODERATE"
                    if tm.accuracy_rate < 0.6:
                        reasons.append(
                            f"Developing mastery ({tm.mastery_score*100:.1f}%) with inconsistent accuracy ({tm.accuracy_rate*100:.0f}%)."
                        )
                    else:
                        reasons.append(
                            f"Mastery ({tm.mastery_score*100:.1f}%) in developing range; needs reinforcement."
                        )
                    suggested_action = "Practice targeted Medium questions with pattern-recognition exercises."

                # Case 2: High attempt struggles
                if tm.avg_attempts >= self.attempt_struggle_threshold:
                    is_weak = True
                    if severity != "CRITICAL":
                        severity = "WARNING"
                    reasons.append(
                        f"High average attempt count ({tm.avg_attempts:.1f} tries/problem) indicates trial-and-error struggling."
                    )
                    if not suggested_action:
                        suggested_action = "Focus on pseudo-code outlining and edge-case verification before coding."

                # Case 3: Prerequisite bottleneck
                if weak_prereqs:
                    is_weak = True
                    prereq_names = [profile.topic_masteries[p].topic_name for p in weak_prereqs]
                    reasons.append(
                        f"Bottleneck from unmastered prerequisite(s): {', '.join(prereq_names)}."
                    )

            if is_weak:
                weaknesses.append(
                    WeaknessAlert(
                        topic_id=topic_id,
                        topic_name=tm.topic_name,
                        severity=severity,
                        mastery_score=tm.mastery_score,
                        accuracy_rate=tm.accuracy_rate,
                        reason=" ".join(reasons),
                        suggested_action=suggested_action or "Review core algorithmic invariants.",
                        prerequisite_bottlenecks=weak_prereqs,
                    )
                )

        # Sort weaknesses by severity priority (CRITICAL first, then MODERATE, then WARNING)
        severity_order = {"CRITICAL": 0, "MODERATE": 1, "WARNING": 2}
        weaknesses.sort(key=lambda w: (severity_order.get(w.severity, 3), w.mastery_score))
        return weaknesses
