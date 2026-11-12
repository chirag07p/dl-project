import json
import os
import sys
import traceback
from typing import Dict, Any, List, Optional
from flask import Flask, request, jsonify
from flask_cors import CORS

from engine import PersonalizedAIEngine

app = Flask(__name__)
# Enable CORS for frontend running on Vite or any local port
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Initialize the Deep Knowledge Tracing Engine
TAXONOMY_PATH = "data/dsa_taxonomy.json"
WEIGHTS_PATH = "weights/dkt_lstm.pt" if os.path.exists("weights/dkt_lstm.pt") else None
DB_PATH = "data/student_store.json"
PSV_PATH = "data/psv/cognipath_cs_dkt.psv" if os.path.exists("data/psv/cognipath_cs_dkt.psv") else None

try:
    engine = PersonalizedAIEngine(
        taxonomy_path=TAXONOMY_PATH,
        weights_path=WEIGHTS_PATH,
        db_path=DB_PATH,
        psv_dataset_path=PSV_PATH,
        device="cpu"
    )
    print("✅ PersonalizedAIEngine initialized with PyTorch DKT LSTM.")
except Exception as e:
    print(f"❌ Error initializing engine: {e}")
    traceback.print_exc()
    engine = None

# Topic Normalization Mapping between Frontend Categories and Backend Taxonomy IDs
FRONTEND_TO_BACKEND_TOPIC = {
    "Arrays and Strings": "arrays",
    "Searching": "arrays",
    "Sorting": "arrays",
    "Linked Lists": "arrays",
    "Stacks and Queues": "arrays",
    "Recursion": "recursion",
    "Trees": "trees",
    "Graphs": "graphs",
    "Dynamic Programming": "dp"
}

BACKEND_TO_FRONTEND_TOPIC = {
    "arrays": "Arrays and Strings",
    "strings": "Arrays and Strings",
    "recursion": "Recursion",
    "trees": "Trees",
    "graphs": "Graphs",
    "dp": "Dynamic Programming"
}

def serialize_profile(profile_obj) -> Dict[str, Any]:
    """Serializes StudentKnowledgeProfile into JSON-safe dictionary."""
    if not profile_obj:
        return {}
    topic_masteries = {}
    for tid, tm in getattr(profile_obj, "topic_masteries", {}).items():
        topic_masteries[tid] = {
            "topic_id": tm.topic_id,
            "topic_name": tm.topic_name,
            "mastery_score": round(float(tm.mastery_score), 4),
            "mastery_level": tm.mastery_level,
            "question_count": tm.question_count,
            "correct_count": tm.correct_count,
            "accuracy_rate": round(float(tm.accuracy_rate), 4),
            "last_practiced_days_ago": getattr(tm, "last_practiced_days_ago", None),
            "confidence": getattr(tm, "confidence", "Medium")
        }
    return {
        "student_id": getattr(profile_obj, "student_id", ""),
        "overall_mastery": round(float(getattr(profile_obj, "overall_mastery", 0.5)), 4),
        "overall_accuracy": round(float(getattr(profile_obj, "overall_accuracy", 0.5)), 4),
        "total_questions_solved": getattr(profile_obj, "total_questions_solved", 0),
        "current_day": getattr(profile_obj, "current_day", 0.0),
        "topic_masteries": topic_masteries
    }

def serialize_weaknesses(weaknesses_list) -> List[Dict[str, Any]]:
    result = []
    for w in (weaknesses_list or []):
        result.append({
            "topic_id": w.topic_id,
            "topic_name": w.topic_name,
            "mastery": round(float(w.mastery), 4),
            "severity": w.severity,
            "reason": w.reason,
            "weak_prerequisites": getattr(w, "weak_prerequisites", []),
            "suggested_action": w.suggested_action
        })
    return result

def serialize_forgetting(alerts_list) -> List[Dict[str, Any]]:
    result = []
    for f in (alerts_list or []):
        result.append({
            "topic_id": f.topic_id,
            "topic_name": f.topic_name,
            "current_retention_rate": round(float(f.current_retention_rate), 4),
            "days_since_practice": round(float(f.days_since_practice), 1),
            "risk_level": f.risk_level,
            "recommended_action": f.recommended_action
        })
    return result

def serialize_learning_style(style_obj) -> Dict[str, Any]:
    if not style_obj:
        return {}
    return {
        "primary_style": getattr(style_obj, "primary_style", "Balanced Explorer"),
        "pace_description": getattr(style_obj, "pace_description", "Moderate"),
        "attempt_behavior": getattr(style_obj, "attempt_behavior", "Thoughtful"),
        "pedagogical_guidance": getattr(style_obj, "pedagogical_guidance", "Continue balanced conceptual practice."),
        "style_scores": getattr(style_obj, "style_scores", {})
    }

def serialize_recommendation(rec_obj) -> Dict[str, Any]:
    if not rec_obj:
        return {}
    suggested_questions = []
    for q in getattr(rec_obj, "suggested_questions", []):
        suggested_questions.append({
            "question_id": q.question_id,
            "topic_id": q.topic_id,
            "title": q.title,
            "difficulty": q.difficulty,
            "description": q.description,
            "tags": q.tags
        })
    revision_plan = []
    for r in getattr(rec_obj, "revision_plan", []):
        revision_plan.append({
            "topic_id": r.topic_id,
            "topic_name": r.topic_name,
            "recommended_difficulty": r.recommended_difficulty,
            "priority": r.priority,
            "urgency_reason": r.urgency_reason
        })
    return {
        "recommended_topic_id": getattr(rec_obj, "recommended_topic_id", "arrays"),
        "recommended_topic_name": getattr(rec_obj, "recommended_topic_name", "Arrays and Strings"),
        "recommended_difficulty": getattr(rec_obj, "recommended_difficulty", "Easy"),
        "reasoning": getattr(rec_obj, "reasoning", "Begin with foundational array patterns."),
        "suggested_questions": suggested_questions,
        "revision_plan": revision_plan
    }

# ==========================================
# REST API Endpoints
# ==========================================

@app.route("/api/health", methods=["GET"])
def health_check():
    """Health status and DKT model diagnostics."""
    return jsonify({
        "status": "online",
        "engine_ready": engine is not None,
        "model_architecture": "PyTorch 2-layer LSTM with Concept & Response Embeddings",
        "topics_supported": list(FRONTEND_TO_BACKEND_TOPIC.keys()),
        "weights_loaded": WEIGHTS_PATH is not None
    })

@app.route("/api/curriculum", methods=["GET"])
def get_curriculum():
    """Curriculum taxonomy, topics, and prerequisites."""
    if not engine:
        return jsonify({"error": "Engine not initialized"}), 500
    return jsonify({
        "topics": engine.taxonomy.get("topics", []),
        "frontend_mapping": FRONTEND_TO_BACKEND_TOPIC,
        "total_curriculum_questions": len(engine.questions)
    })

@app.route("/api/student/<student_id>", methods=["GET"])
def get_student_profile(student_id: str):
    """
    Executes the full DKT pipeline for the given student and returns
    live mastery, weakness analysis, forgetting alerts, and recommendations.
    """
    if not engine:
        return jsonify({"error": "Engine not initialized"}), 500
    try:
        pipeline = engine.run_full_pipeline(student_id)
        return jsonify({
            "student_id": pipeline["student_id"],
            "student_name": pipeline["student_name"],
            "current_day": pipeline["current_day"],
            "profile": serialize_profile(pipeline["profile"]),
            "weaknesses": serialize_weaknesses(pipeline["weaknesses"]),
            "forgetting_alerts": serialize_forgetting(pipeline["forgetting_alerts"]),
            "learning_style": serialize_learning_style(pipeline["learning_style"]),
            "recommendation": serialize_recommendation(pipeline["recommendation"])
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/student/setup", methods=["POST"])
def setup_student():
    """Initializes or updates a student profile with learning goals and preferences."""
    if not engine:
        return jsonify({"error": "Engine not initialized"}), 500
    data = request.get_json() or {}
    student_id = data.get("student_id", "demo_student")
    full_name = data.get("full_name", "Student")
    student = engine.get_or_create_student(student_id, student_name=full_name)
    student["preferences"] = {
        "learning_goal": data.get("learning_goal", "Interview Preparation"),
        "preferred_difficulty": data.get("preferred_difficulty", "Medium"),
        "initial_topic": data.get("initial_topic", "Arrays and Strings"),
        "daily_target": data.get("daily_target", 5)
    }
    engine._save_student_store()
    return jsonify({"success": True, "student": student})

@app.route("/api/interact", methods=["POST"])
def record_interaction():
    """
    Records a problem submission from the frontend.
    Runs PyTorch DKT LSTM forward pass to dynamically trace knowledge state.
    """
    if not engine:
        return jsonify({"error": "Engine not initialized"}), 500

    data = request.get_json() or {}
    student_id = data.get("student_id", "demo_student")
    question_id = data.get("question_id", "AS-EASY-01")
    topic_name = data.get("topic", "Arrays and Strings")
    correct = 1 if data.get("is_correct") else 0
    time_taken = float(data.get("time_taken_seconds", 60.0))
    attempts = int(data.get("attempts", 1))
    days_advanced = float(data.get("days_advanced", 0.1))

    # Map question_id to backend taxonomy id if needed
    backend_topic = FRONTEND_TO_BACKEND_TOPIC.get(topic_name, "arrays")
    backend_qid = None
    if question_id in engine.question_lookup:
        backend_qid = question_id
    else:
        # Match by topic
        candidates = [q["id"] for q in engine.questions if q["topic_id"] == backend_topic]
        backend_qid = candidates[0] if candidates else "q_arr_01"

    try:
        # 1. Record interaction
        interaction = engine.record_interaction(
            student_id=student_id,
            question_id=backend_qid,
            correct=correct,
            time_taken_sec=time_taken,
            attempts=attempts,
            days_advanced=days_advanced,
            sync_to_dataset=True
        )

        # 2. Run full pipeline with DKT LSTM
        pipeline = engine.run_full_pipeline(student_id)

        # 3. Compute predicted mastery probability for this topic
        serialized_profile = serialize_profile(pipeline["profile"])
        topic_m = serialized_profile.get("topic_masteries", {}).get(backend_topic, {})
        new_mastery = topic_m.get("mastery_score", 0.5)

        return jsonify({
            "success": True,
            "recorded_interaction": interaction,
            "topic": topic_name,
            "backend_topic": backend_topic,
            "new_topic_mastery": new_mastery,
            "overall_mastery": serialized_profile.get("overall_mastery", 0.5),
            "profile": serialized_profile,
            "weaknesses": serialize_weaknesses(pipeline["weaknesses"]),
            "forgetting_alerts": serialize_forgetting(pipeline["forgetting_alerts"]),
            "learning_style": serialize_learning_style(pipeline["learning_style"]),
            "recommendation": serialize_recommendation(pipeline["recommendation"])
        })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/api/ask", methods=["POST"])
def ask_ai_tutor():
    """
    Interactive AI Copilot / Tutor endpoint.
    Answers queries from the frontend by combining question context,
    the student's current DKT knowledge profile, and diagnostic analytics.
    """
    if not engine:
        return jsonify({"error": "Engine not initialized"}), 500

    data = request.get_json() or {}
    student_id = data.get("student_id", "demo_student")
    user_query = data.get("query", "").strip()
    topic = data.get("topic", "Arrays and Strings")
    question_title = data.get("question_title", "")
    code_snippet = data.get("code_snippet", "")
    is_correct = data.get("is_correct", None)

    backend_topic = FRONTEND_TO_BACKEND_TOPIC.get(topic, "arrays")
    student = engine.get_or_create_student(student_id)
    pipeline = engine.run_full_pipeline(student_id)
    profile = pipeline["profile"]
    style = pipeline["learning_style"]
    weaknesses = pipeline["weaknesses"]

    topic_m = profile.topic_masteries.get(backend_topic)
    mastery_pct = round(topic_m.mastery_score * 100, 1) if topic_m else 50.0

    # Build pedagogical response based on DKT knowledge profile
    related_weaknesses = [w for w in weaknesses if w.topic_id == backend_topic]
    has_weak_prereq = len(related_weaknesses) > 0 and len(related_weaknesses[0].weak_prerequisites) > 0

    response_parts = []
    
    # 1. Direct answer / greeting & contextual mastery
    response_parts.append(
        f"**CogniPath AI Tutor:** I analyzed your current learning state for **{topic}** "
        f"(DKT Estimated Mastery: **{mastery_pct}%** • Level: *{topic_m.mastery_level if topic_m else 'Developing'}*)."
    )

    # 2. Targeted Conceptual Guidance based on user query
    q_lower = user_query.lower()
    if "why" in q_lower or "explain" in q_lower or "how" in q_lower:
        if "time" in q_lower or "complexity" in q_lower:
            response_parts.append(
                "### ⏱️ Time & Space Complexity Analysis\n"
                "- **Optimal Time Complexity:** Most two-pointer and sliding window approaches achieve **O(n)** time because each pointer advances at most `n` times.\n"
                "- **Space Complexity:** **O(1)** auxiliary memory since pointers modify index markers in-place without copying the underlying buffer."
            )
        elif "invariant" in q_lower or "pointer" in q_lower or "two sum" in q_lower:
            response_parts.append(
                "### 💡 Two-Pointer Invariant Breakdown\n"
                "When the array is sorted in ascending order:\n"
                "1. If `numbers[left] + numbers[right] > target`, the current sum is strictly too large. Since `numbers[left]` is already the smallest remaining candidate on the left boundary, no element added to `numbers[right]` can ever reach `target`. Therefore, the only valid decision is **`right--`**.\n"
                "2. Conversely, if `currentSum < target`, the sum is too small; advance **`left++`**."
            )
        else:
            response_parts.append(
                f"### 🔍 Conceptual Foundation for {topic}\n"
                f"Focus on identifying the pattern invariant before writing code. Notice how constraints (such as sorted order or monotonic ranges) eliminate half the search space at each decision point."
            )
    elif "recommend" in q_lower or "next" in q_lower or "what should i practice" in q_lower:
        rec = pipeline["recommendation"]
        response_parts.append(
            f"### 🎯 Recommended Learning Path\n"
            f"Based on your DKT mastery curve, your next focus area is **{rec.recommended_topic_name}** at **{rec.recommended_difficulty}** difficulty.\n"
            f"- **Pedagogical Rationale:** {rec.reasoning}"
        )
    else:
        # General question explanation
        response_parts.append(
            f"### 💡 Deep Learning Analysis for '{question_title or topic}'\n"
            f"You asked: *\"{user_query}\"*\n\n"
            f"Here is the systematic mental model:\n"
            f"1. **State the Invariant:** What property must hold true across all iterations?\n"
            f"2. **Identify Edge Cases:** Empty structures, duplicate values, and single-element bounds.\n"
            f"3. **Prerequisite Check:** "
            + (f"Note that {topic} builds upon prerequisite foundations. Ensure your baseline is verified." if has_weak_prereq else "Your foundational prerequisites for this topic are currently solid.")
        )

    # 3. Learning Style Adaption
    response_parts.append(
        f"\n*AI Learning Style Note:* You are categorized as a **{style.primary_style}**. "
        f"{style.pedagogical_guidance}"
    )

    full_reply = "\n\n".join(response_parts)

    return jsonify({
        "success": True,
        "query": user_query,
        "topic": topic,
        "topic_mastery": mastery_pct,
        "mastery_level": topic_m.mastery_level if topic_m else "Developing",
        "answer": full_reply,
        "primary_style": style.primary_style
    })

@app.route("/api/reset-demo", methods=["POST"])
def reset_demo():
    """Resets student state to fresh baseline."""
    if not engine:
        return jsonify({"error": "Engine not initialized"}), 500
    engine.student_store = {}
    engine._save_student_store()
    return jsonify({"success": True, "message": "Demo student store reset to baseline."})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Starting CogniPath AI Backend REST API Server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
