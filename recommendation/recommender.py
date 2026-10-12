from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
import numpy as np

from models.knowledge_profile import StudentKnowledgeProfile
from models.weakness_detector import WeaknessAlert
from models.forgetting_detector import ForgettingAlert
from models.learning_style import LearningStyleProfile


@dataclass
class QuestionRecommendation:
    question_id: str
    title: str
    topic_id: str
    topic_name: str
    difficulty: str
    reason: str
    description: str
    tags: List[str]


@dataclass
class RevisionItem:
    topic_id: str
    topic_name: str
    priority: str             # HIGH, MEDIUM, SCHEDULED
    urgency_reason: str
    days_since_practice: float
    recommended_difficulty: str


@dataclass
class RecommendationResult:
    recommended_topic_id: str
    recommended_topic_name: str
    recommended_difficulty: str
    reasoning: str
    suggested_questions: List[QuestionRecommendation]
    revision_plan: List[RevisionItem]
    learning_style_adaptation: str


class PersonalizedRecommender:
    """
    Synthesizes the Knowledge Profile, Weakness Alerts, Forgetting Risks,
    and Learning Style to generate:
      1. Next optimal Topic (Zone of Proximal Development)
      2. Dynamic Difficulty Adjustment (Easy, Medium, Hard)
      3. Concrete Question Recommendations
      4. Spaced Repetition Revision Plan
    """

    def __init__(
        self,
        taxonomy: Dict[str, Any],
        questions: List[Dict[str, Any]],
        prerequisites: Dict[str, List[str]],
    ):
        self.taxonomy = taxonomy
        self.questions = questions
        self.prerequisites = prerequisites

        # Group questions by topic and difficulty
        self.questions_by_topic_diff: Dict[str, Dict[str, List[Dict[str, Any]]]] = {}
        for q in questions:
            tid = q["topic_id"]
            diff = q["difficulty"]
            if tid not in self.questions_by_topic_diff:
                self.questions_by_topic_diff[tid] = {"Easy": [], "Medium": [], "Hard": []}
            if diff in self.questions_by_topic_diff[tid]:
                self.questions_by_topic_diff[tid][diff].append(q)

    def determine_difficulty(self, mastery_score: float) -> str:
        """
        Dynamically adjusts difficulty matching student's current mastery level.
        """
        if mastery_score < 0.45:
            return "Easy"
        elif mastery_score < 0.75:
            return "Medium"
        else:
            return "Hard"

    def recommend(
        self,
        profile: StudentKnowledgeProfile,
        weaknesses: List[WeaknessAlert],
        forgetting_alerts: List[ForgettingAlert],
        style: LearningStyleProfile,
        solved_question_ids: Optional[List[str]] = None,
    ) -> RecommendationResult:
        solved_ids = set(solved_question_ids or [])

        # 1. Build Revision Plan from Forgetting alerts & Critical weaknesses
        revision_plan: List[RevisionItem] = []
        for f_alert in forgetting_alerts:
            tm = profile.topic_masteries.get(f_alert.topic_id)
            m_score = tm.mastery_score if tm else 0.5
            diff = self.determine_difficulty(m_score)
            priority = "HIGH" if f_alert.risk_level == "HIGH" else "MEDIUM"
            revision_plan.append(
                RevisionItem(
                    topic_id=f_alert.topic_id,
                    topic_name=f_alert.topic_name,
                    priority=priority,
                    urgency_reason=f"Retention dropped to {f_alert.current_retention_rate*100:.0f}% after {f_alert.days_since_practice:.1f} days without review.",
                    days_since_practice=f_alert.days_since_practice,
                    recommended_difficulty=diff,
                )
            )

        # 2. Topic Recommendation using Zone of Proximal Development (ZPD)
        # Priority rules:
        # A) Urgent Forgetting revision topic
        # B) Active Critical Weakness topic (if its prerequisites are solid)
        # C) Next unmastered topic in curriculum whose prerequisites are mastered (>=0.60)
        # D) Highest progress topic to reach full mastery

        target_topic_id = None
        target_reason = ""

        # Check A: High forgetting risk
        high_forgetting = [f for f in forgetting_alerts if f.risk_level == "HIGH"]
        if high_forgetting:
            target_topic_id = high_forgetting[0].topic_id
            target_reason = (
                f"Memory retention alert: {high_forgetting[0].topic_name} requires immediate spaced repetition "
                f"before knowledge decays further."
            )

        # Check B: Critical weakness
        if not target_topic_id:
            crit_weaknesses = [w for w in weaknesses if w.severity == "CRITICAL"]
            for w in crit_weaknesses:
                # Ensure prerequisites are at least 0.50
                prereqs = self.prerequisites.get(w.topic_id, [])
                prereqs_ok = all(
                    profile.topic_masteries[p].mastery_score >= 0.50
                    for p in prereqs
                    if p in profile.topic_masteries
                )
                if prereqs_ok:
                    target_topic_id = w.topic_id
                    target_reason = (
                        f"Targeted remediation: {w.topic_name} is flagged with low accuracy ({w.accuracy_rate*100:.0f}%). "
                        f"Strengthening this will unblock advanced topics."
                    )
                    break

        # Check C: Curriculum ZPD
        if not target_topic_id:
            ordered_topics = sorted(self.taxonomy.get("topics", []), key=lambda t: t.get("order", 0))
            for t in ordered_topics:
                tid = t["id"]
                tm = profile.topic_masteries.get(tid)
                m_score = tm.mastery_score if tm else 0.35

                # If topic not yet mastered (< 0.75)
                if m_score < 0.75:
                    prereqs = self.prerequisites.get(tid, [])
                    # Check if all prerequisites have >= 0.55 mastery
                    prereqs_met = all(
                        profile.topic_masteries[p].mastery_score >= 0.55
                        for p in prereqs
                        if p in profile.topic_masteries
                    )
                    if prereqs_met:
                        target_topic_id = tid
                        target_reason = (
                            f"Zone of Proximal Development: Prerequisite foundations are strong. "
                            f"Ready to progress into {t['name']}."
                        )
                        break

        # Fallback: Topic with lowest mastery
        if not target_topic_id:
            sorted_by_mastery = sorted(
                profile.topic_masteries.values(),
                key=lambda tm: tm.mastery_score,
            )
            target_topic_id = sorted_by_mastery[0].topic_id
            target_reason = f"Reinforcement practice on {sorted_by_mastery[0].topic_name}."

        target_tm = profile.topic_masteries.get(target_topic_id)
        current_mastery = target_tm.mastery_score if target_tm else 0.40
        topic_name = target_tm.topic_name if target_tm else target_topic_id

        # 3. Dynamic Difficulty Adjustment
        difficulty = self.determine_difficulty(current_mastery)

        # Style adjustment note:
        style_adaptation = (
            f"Tailored for '{style.primary_style}': "
            f"Hint mode: {style.recommended_hint_mode}. {style.pedagogical_guidance}"
        )

        # 4. Pick candidate questions
        topic_pool = self.questions_by_topic_diff.get(target_topic_id, {})
        primary_candidates = [
            q for q in topic_pool.get(difficulty, []) if q["id"] not in solved_ids
        ]

        # If all questions at current difficulty are solved, try adjacent difficulty
        if not primary_candidates:
            diff_fallback = ["Medium", "Easy", "Hard"] if difficulty == "Easy" else ["Hard", "Medium", "Easy"]
            for d in diff_fallback:
                primary_candidates = [
                    q for q in topic_pool.get(d, []) if q["id"] not in solved_ids
                ]
                if primary_candidates:
                    difficulty = d
                    break

        # If all questions in this topic were solved, pick best questions anyway
        if not primary_candidates and topic_pool.get(difficulty):
            primary_candidates = topic_pool.get(difficulty, [])

        suggested_questions: List[QuestionRecommendation] = []
        for q in primary_candidates[:3]:
            suggested_questions.append(
                QuestionRecommendation(
                    question_id=q["id"],
                    title=q["title"],
                    topic_id=target_topic_id,
                    topic_name=topic_name,
                    difficulty=q["difficulty"],
                    reason=f"Matches your estimated mastery ({current_mastery*100:.0f}%) in {topic_name}",
                    description=q["description"],
                    tags=q.get("tags", []),
                )
            )

        return RecommendationResult(
            recommended_topic_id=target_topic_id,
            recommended_topic_name=topic_name,
            recommended_difficulty=difficulty,
            reasoning=target_reason,
            suggested_questions=suggested_questions,
            revision_plan=revision_plan,
            learning_style_adaptation=style_adaptation,
        )
