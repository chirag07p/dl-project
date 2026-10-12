import json
import os
import time
import streamlit as st
import plotly.graph_objects as go
import plotly.express as px

from engine import PersonalizedAIEngine

# Page configuration
st.set_page_config(
    page_title="Personalized AI Learning | Deep Knowledge Tracing",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom Glassmorphism Dark Theme CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    .main-header {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(6, 182, 212, 0.15) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 24px 32px;
        margin-bottom: 24px;
        backdrop-filter: blur(12px);
    }

    .metric-card {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px;
        padding: 18px 22px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    }

    .badge-critical {
        background: rgba(239, 68, 68, 0.2);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.4);
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .badge-warning {
        background: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
        border: 1px solid rgba(245, 158, 11, 0.4);
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .badge-success {
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .stButton>button {
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.2s ease-in-out;
    }

    .rec-box {
        background: linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%);
        border: 1px solid rgba(99, 102, 241, 0.3);
        border-radius: 16px;
        padding: 20px;
        margin-top: 12px;
    }
</style>
""", unsafe_allow_html=True)


@st.cache_resource
def get_engine():
    weights_path = "weights/dkt_lstm.pt" if os.path.exists("weights/dkt_lstm.pt") else None
    return PersonalizedAIEngine(
        taxonomy_path="data/dsa_taxonomy.json",
        weights_path=weights_path,
        db_path="data/web_students.json",
    )


engine = get_engine()

# Sidebar: Student Profile & Controls
st.sidebar.image("https://img.icons8.com/fluency/96/brain--v1.png", width=64)
st.sidebar.title("Student Control Center")

student_id = st.sidebar.text_input("Student Identifier", value="alex_coder").strip() or "alex_coder"
student_data = engine.get_or_create_student(student_id)

st.sidebar.markdown("---")
st.sidebar.subheader("Simulation Controls")

# Fast forward time to test Forgetting curve
days_to_advance = st.sidebar.number_input("Advance Timeline (Days)", min_value=0.0, max_value=60.0, value=0.0, step=1.0)
if st.sidebar.button("Advance Days ⏩", use_container_width=True):
    if days_to_advance > 0:
        student_data["current_day"] = round(student_data.get("current_day", 0.0) + days_to_advance, 2)
        engine._save_student_store()
        st.sidebar.success(f"Timeline moved to Day {student_data['current_day']}!")
        st.rerun()

st.sidebar.markdown("---")
st.sidebar.subheader("Student Archetype Presets")
st.sidebar.caption("Demonstrates Section 1: Both score 70% overall, but need completely different paths.")

col_p1, col_p2 = st.sidebar.columns(2)
with col_p1:
    if st.button("👤 Student A (70%)", use_container_width=True, help="Strong Arrays/Strings (90%), Weak Recursion/DP (40%)"):
        engine.seed_student_profile_preset(student_id, preset="student_a")
        st.rerun()

with col_p2:
    if st.button("👤 Student B (70%)", use_container_width=True, help="Weak Arrays/Strings (50%), Strong Recursion/Trees (90%)"):
        engine.seed_student_profile_preset(student_id, preset="student_b")
        st.rerun()

col_p3, col_p4 = st.sidebar.columns(2)
with col_p3:
    if st.button("⌛ Forgetful", use_container_width=True, help="Simulate 25 days elapsed to test Ebbinghaus decay"):
        student_data["current_day"] = round(student_data.get("current_day", 1.0) + 22.0, 1)
        engine._save_student_store()
        st.rerun()

with col_p4:
    if st.button("🗑️ Reset", use_container_width=True, help="Clear history for fresh assessment"):
        student_data["interactions"] = []
        student_data["current_day"] = 0.0
        engine._save_student_store()
        st.rerun()

# Run Engine Pipeline
pipeline_data = engine.run_full_pipeline(student_id)
profile = pipeline_data["profile"]
weaknesses = pipeline_data["weaknesses"]
forgetting_alerts = pipeline_data["forgetting_alerts"]
learning_style = pipeline_data["learning_style"]
rec = pipeline_data["recommendation"]

# Main App Header
st.markdown(f"""
<div class="main-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 style="margin: 0; font-size: 2.2rem; font-weight: 800; background: linear-gradient(90deg, #60a5fa, #c084fc, #38bdf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                Personalized AI Learning Engine
            </h1>
            <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 1.05rem;">
                Deep Knowledge Tracing (DKT-LSTM) · Weakness & Forgetting Detection · Adaptive DSA Path
            </p>
        </div>
        <div style="text-align: right;">
            <div style="background: rgba(99, 102, 241, 0.2); border: 1px solid rgba(99, 102, 241, 0.4); border-radius: 12px; padding: 6px 14px; display: inline-block;">
                <span style="color: #a5b4fc; font-weight: 600;">Student:</span> <strong>{student_id}</strong> | 
                <span style="color: #38bdf8; font-weight: 600;">Day {pipeline_data['current_day']:.1f}</span>
            </div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Top Metric Cards
col1, col2, col3, col4, col5 = st.columns(5)
with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">Overall Mastery</div>
        <div style="color: #60a5fa; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{profile.overall_mastery*100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">Questions Solved</div>
        <div style="color: #34d399; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{profile.total_questions_solved}</div>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">Accuracy Rate</div>
        <div style="color: #f472b6; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{profile.overall_accuracy*100:.1f}%</div>
    </div>
    """, unsafe_allow_html=True)

with col4:
    badge_style = "badge-critical" if weaknesses else "badge-success"
    w_label = f"{len(weaknesses)} Alert(s)" if weaknesses else "Clean"
    st.markdown(f"""
    <div class="metric-card">
        <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">Cognitive Weaknesses</div>
        <div style="color: #f87171; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{w_label}</div>
    </div>
    """, unsafe_allow_html=True)

with col5:
    f_label = f"{len(forgetting_alerts)} Topic(s)" if forgetting_alerts else "Retained"
    st.markdown(f"""
    <div class="metric-card">
        <div style="color: #94a3b8; font-size: 0.85rem; font-weight: 500;">Forgetting Risk</div>
        <div style="color: #fbbf24; font-size: 1.8rem; font-weight: 700; margin-top: 4px;">{f_label}</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<div style='height: 16px;'></div>", unsafe_allow_html=True)

# Navigation Tabs
tabs = st.tabs([
    "🎯 Personalized Recommendations",
    "📊 Knowledge Profile & DKT Radar",
    "🔍 Diagnostic Intelligence ('Why are you weak?')",
    "📝 Multi-Topic Diagnostic Assessment",
    "💻 Single Question Practice",
    "⚙️ DL Model Architecture",
])

# ----------------- TAB 1: RECOMMENDATIONS -----------------
with tabs[0]:
    col_rec_left, col_rec_right = st.columns([1.2, 1])

    with col_rec_left:
        st.subheader("Next Recommended Learning Objective")
        st.markdown(f"""
        <div class="rec-box">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 1.3rem; font-weight: 700; color: #818cf8;">
                    🎯 {rec.recommended_topic_name}
                </span>
                <span class="badge-warning" style="font-size: 0.9rem;">
                    Target Difficulty: {rec.recommended_difficulty}
                </span>
            </div>
            <p style="color: #cbd5e1; margin-top: 10px; font-size: 0.95rem; line-height: 1.5;">
                <strong>Pedagogical Rationale:</strong> {rec.reasoning}
            </p>
            <div style="margin-top: 8px; font-size: 0.9rem; color: #94a3b8;">
                💡 <strong>Learning Style Fit:</strong> {rec.learning_style_adaptation}
            </div>
        </div>
        """, unsafe_allow_html=True)

        st.markdown("<h4 style='margin-top: 24px;'>Recommended Practice Questions</h4>", unsafe_allow_html=True)
        if rec.suggested_questions:
            for q in rec.suggested_questions:
                diff_color = "#34d399" if q.difficulty == "Easy" else ("#fbbf24" if q.difficulty == "Medium" else "#f87171")
                with st.expander(f"[{q.difficulty}] {q.title} - {q.topic_name}", expanded=True):
                    st.write(q.description)
                    st.caption(f"Tags: {', '.join(q.tags)} | {q.reason}")
                    if st.button(f"Start Solving: {q.title}", key=f"rec_btn_{q.question_id}"):
                        st.session_state["selected_question_id"] = q.question_id
                        st.info(f"Loaded '{q.title}' into the 'Solve DSA Questions' tab! Switch to tab 4 to submit.")
        else:
            st.success("You have solved all currently queued questions for this topic!")

    with col_rec_right:
        st.subheader("📅 Spaced Repetition Revision Queue")
        if rec.revision_plan:
            st.info("Ebbinghaus memory decay modeling has flagged these topics for retention maintenance.")
            for r in rec.revision_plan:
                p_badge = "badge-critical" if r.priority == "HIGH" else "badge-warning"
                st.markdown(f"""
                <div style="background: rgba(30, 41, 59, 0.5); border-left: 4px solid {'#ef4444' if r.priority=='HIGH' else '#f59e0b'}; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>{r.topic_name}</strong>
                        <span class="{p_badge}">{r.priority}</span>
                    </div>
                    <div style="color: #94a3b8; font-size: 0.85rem; margin-top: 4px;">{r.urgency_reason}</div>
                    <div style="color: #38bdf8; font-size: 0.8rem; margin-top: 4px;">Recommended: {r.recommended_difficulty} difficulty problems</div>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.success("🎉 No pending forgetting alerts! All practiced topics remain well within the memory retention window.")

# ----------------- TAB 2: KNOWLEDGE PROFILE -----------------
with tabs[1]:
    col_radar, col_bars = st.columns([1.1, 1.3])

    with col_radar:
        st.subheader("Topic Mastery Radar")
        categories = [tm.topic_name for tm in profile.topic_masteries.values()]
        values = [tm.mastery_score * 100 for tm in profile.topic_masteries.values()]

        # Close the loop
        categories_closed = categories + [categories[0]]
        values_closed = values + [values[0]]

        fig = go.Figure()
        fig.add_trace(go.Scatterpolar(
            r=values_closed,
            theta=categories_closed,
            fill='toself',
            fillcolor='rgba(99, 102, 241, 0.25)',
            line=dict(color='#818cf8', width=2),
            name='Current Mastery'
        ))
        fig.update_layout(
            polar=dict(
                radialaxis=dict(visible=True, range=[0, 100], ticksuffix="%", gridcolor="rgba(255,255,255,0.1)"),
                angularaxis=dict(gridcolor="rgba(255,255,255,0.1)"),
                bgcolor="rgba(0,0,0,0)"
            ),
            paper_bgcolor="rgba(0,0,0,0)",
            plot_bgcolor="rgba(0,0,0,0)",
            font=dict(color="#cbd5e1"),
            margin=dict(l=40, r=40, t=20, b=20),
            showlegend=False,
            height=420,
        )
        st.plotly_chart(fig, use_container_width=True)

    with col_bars:
        st.subheader("Topic-wise Knowledge Breakdown")
        for tid, tm in profile.topic_masteries.items():
            col_t1, col_t2 = st.columns([2, 1])
            with col_t1:
                st.write(f"**{tm.topic_name}** ({tm.question_count} solved · {tm.accuracy_rate*100:.0f}% acc)")
                color = "#34d399" if tm.mastery_score >= 0.70 else ("#fbbf24" if tm.mastery_score >= 0.45 else "#f87171")
                st.progress(float(tm.mastery_score))
            with col_t2:
                st.markdown(f"<div style='margin-top: 8px;'><span class='badge-{'success' if tm.mastery_level in ['Proficient','Mastered'] else ('warning' if tm.mastery_level=='Intermediate' else 'critical')}'>{tm.mastery_level} ({tm.mastery_score*100:.0f}%)</span></div>", unsafe_allow_html=True)

# ----------------- TAB 3: DIAGNOSTIC INTELLIGENCE -----------------
with tabs[2]:
    st.subheader("Cognitive Diagnostics Triad")
    st.caption("Derived from the DKT-LSTM hidden state representations and cognitive behavior telemetry.")

    diag_col1, diag_col2, diag_col3 = st.columns(3)

    with diag_col1:
        st.markdown("### 🚨 Weakness Detection")
        if weaknesses:
            for w in weaknesses:
                s_badge = "badge-critical" if w.severity == "CRITICAL" else "badge-warning"
                detailed_reasons = engine.explain_weakness_reasons(w)
                reasons_html = "".join([f"<li style='margin-bottom: 4px;'>{r}</li>" for r in detailed_reasons])
                st.markdown(f"""
                <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: #f87171;">{w.topic_name}</strong>
                        <span class="{s_badge}">{w.severity}</span>
                    </div>
                    <p style="font-size: 0.85rem; color: #cbd5e1; margin-top: 8px;">{w.reason}</p>
                    <div style="font-size: 0.85rem; color: #e2e8f0; margin-top: 6px;">
                        <strong style="color: #fca5a5;">Why You're Struggling:</strong>
                        <ul style="margin: 4px 0 6px 18px; padding: 0; color: #94a3b8; font-size: 0.82rem;">
                            {reasons_html}
                        </ul>
                    </div>
                    <div style="font-size: 0.8rem; color: #38bdf8; margin-top: 6px;"><strong>Remedy:</strong> {w.suggested_action}</div>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.success("No active weakness blockers. Smooth learning trajectory!")

    with diag_col2:
        st.markdown("### ⏳ Forgetting Detection")
        if forgetting_alerts:
            for f in forgetting_alerts:
                st.markdown(f"""
                <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color: #fbbf24;">{f.topic_name}</strong>
                        <span class="badge-warning">{f.risk_level} RISK</span>
                    </div>
                    <div style="margin-top: 8px; font-size: 0.85rem;">
                        <div>Current Retention: <strong>{f.current_retention_rate*100:.0f}%</strong></div>
                        <div>Last Practiced: <strong>{f.days_since_practice:.1f} days ago</strong></div>
                        <div>Half-Life: <strong>~{f.memory_half_life_days:.1f} days</strong></div>
                    </div>
                    <div style="font-size: 0.8rem; color: #a5b4fc; margin-top: 6px;">Urgency Score: {f.urgency_score:.2f}</div>
                </div>
                """, unsafe_allow_html=True)
        else:
            st.success("All concepts are actively retained. Memory half-life is stable!")

    with diag_col3:
        st.markdown("### 🧠 Learning Style Detection")
        st.markdown(f"""
        <div style="background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; padding: 14px;">
            <div style="font-size: 1.15rem; font-weight: 700; color: #c084fc;">{learning_style.primary_style}</div>
            <div style="margin-top: 8px; font-size: 0.88rem; color: #cbd5e1;">
                <div>⚡ Solving Pace: <strong>{learning_style.pace_description}</strong></div>
                <div>🎯 Attempt Style: <strong>{learning_style.attempt_behavior}</strong></div>
                <div>⏱️ Time Efficiency Ratio: <strong>{learning_style.time_efficiency_index:.2f}x</strong></div>
                <div>💪 Persistence Score: <strong>{learning_style.persistence_index:.2f}/1.0</strong></div>
            </div>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 10px 0;">
            <div style="font-size: 0.85rem; color: #38bdf8;"><strong>Pedagogical Advice:</strong><br>{learning_style.pedagogical_guidance}</div>
            <div style="font-size: 0.8rem; color: #a5b4fc; margin-top: 6px;"><strong>Hinting Policy:</strong> {learning_style.recommended_hint_mode}</div>
        </div>
        """, unsafe_allow_html=True)

# ----------------- TAB 4: MULTI-TOPIC DIAGNOSTIC ASSESSMENT -----------------
with tabs[3]:
    st.subheader("📝 Multi-Topic Diagnostic Assessment (Questionnaire)")
    st.markdown("""
    Instead of testing only a single isolated question, this comprehensive questionnaire tests key concepts 
    across **Arrays, Strings, Recursion, Trees, Graphs, and DP** simultaneously.
    Submitting updates the PyTorch DKT LSTM with your full baseline knowledge trajectory at once!
    """)

    diag_qs = engine.get_diagnostic_assessment_questions(num_per_topic=1)
    
    with st.form("diagnostic_questionnaire_form"):
        form_answers = []
        for i, q in enumerate(diag_qs, 1):
            tname = engine.topic_names.get(q["topic_id"], q["topic_id"])
            st.markdown(f"#### Question {i}: {q['title']} · *{tname}* `[{q['difficulty']}]`")
            st.markdown(f"**Concept:** {q.get('concept_tested', q['title'])}")
            st.markdown(f"> {q.get('question_text', q['description'])}")
            
            opts = q.get("options", ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"])
            user_choice = st.radio(f"Select your answer for Q{i}:", options=opts, key=f"diag_opt_{q['id']}")
            
            with st.expander(f"💡 Need a hint for Q{i}?"):
                st.info(q.get("hint", "Consider time and memory complexity bounds."))
            
            q_time = st.slider(f"Time spent on Q{i} (seconds)", min_value=15, max_value=600, value=q.get("expected_time_sec", 120), step=15, key=f"diag_time_{q['id']}")
            
            chosen_idx = opts.index(user_choice) if user_choice in opts else 0
            correct_idx = q.get("correct_index", 0)
            is_corr = 1 if chosen_idx == correct_idx else 0
            
            form_answers.append({
                "question_id": q["id"],
                "correct": is_corr,
                "time_taken_sec": float(q_time),
                "attempts": 1,
                "days_advanced": 0.2,
            })
            st.markdown("---")
        
        submitted = st.form_submit_button("🚀 Submit Full Diagnostic Assessment (Feed to DKT LSTM)", use_container_width=True, type="primary")
        if submitted:
            engine.record_questionnaire_results(student_id, form_answers)
            num_corr = sum(a["correct"] for a in form_answers)
            st.success(f"Assessment Complete! Scored {num_corr}/{len(form_answers)}. Deep Learning model updated across all concepts!")
            st.balloons()
            time.sleep(1.0)
            st.rerun()

# ----------------- TAB 5: SINGLE QUESTION PRACTICE -----------------
with tabs[4]:
    st.subheader("DSA Question Solving & Live Model Feed")
    st.markdown("Submit problem solving outcomes here to trigger real-time PyTorch LSTM inference and profile updating.")

    col_q_select, col_q_inputs = st.columns([1.2, 1])

    with col_q_select:
        # Preselect if chosen from recommendations
        all_q_ids = [q["id"] for q in engine.questions]
        default_index = 0
        if "selected_question_id" in st.session_state and st.session_state["selected_question_id"] in all_q_ids:
            default_index = all_q_ids.index(st.session_state["selected_question_id"])

        chosen_qid = st.selectbox(
            "Select Question to Solve",
            options=all_q_ids,
            index=default_index,
            format_func=lambda qid: f"[{engine.question_lookup[qid]['difficulty']}] {engine.question_lookup[qid]['title']} ({engine.question_lookup[qid]['topic_id']})"
        )

        q_obj = engine.question_lookup[chosen_qid]
        st.markdown(f"""
        <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 18px; margin-top: 10px;">
            <h4 style="margin: 0; color: #60a5fa;">{q_obj['title']}</h4>
            <div style="color: #94a3b8; font-size: 0.85rem; margin: 4px 0 12px 0;">Topic: <strong>{q_obj['topic_id']}</strong> | Difficulty: <strong>{q_obj['difficulty']}</strong> | Baseline: <strong>{q_obj['expected_time_sec']}s</strong></div>
            <p style="color: #e2e8f0; font-size: 0.95rem;">{q_obj['description']}</p>
            <div style="color: #a5b4fc; font-size: 0.8rem;">Tags: {', '.join(q_obj.get('tags', []))}</div>
        </div>
        """, unsafe_allow_html=True)

    with col_q_inputs:
        st.markdown("#### Execution Telemetry")
        is_correct = st.radio("Did you solve the problem successfully?", ["✅ Yes (Solved Correctly)", "❌ No (Failed / Test Errors)"], index=0)
        correct_val = 1 if "Yes" in is_correct else 0

        time_spent = st.slider("Time Spent (Seconds)", min_value=30, max_value=1200, value=q_obj["expected_time_sec"], step=10)
        attempt_count = st.number_input("Number of Code Attempts / Judge Submissions", min_value=1, max_value=10, value=1, step=1)
        day_progression = st.slider("Timeline Advance (Days since previous interaction)", min_value=0.0, max_value=5.0, value=0.5, step=0.25)

        if st.button("🚀 Submit to Deep Learning Model", use_container_width=True, type="primary"):
            interaction = engine.record_interaction(
                student_id=student_id,
                question_id=chosen_qid,
                correct=correct_val,
                time_taken_sec=float(time_spent),
                attempts=int(attempt_count),
                days_advanced=float(day_progression),
            )
            st.balloons() if correct_val == 1 else st.warning("Recorded. Model updated with error patterns.")
            st.success(f"Interaction logged! Deep Learning Knowledge State h_t updated for topic '{q_obj['topic_id']}'.")
            time.sleep(0.6)
            st.rerun()

# ----------------- TAB 6: ARCHITECTURE INSPECTOR -----------------
with tabs[5]:
    st.subheader("Deep Learning Knowledge Tracing Architecture")
    st.markdown("""
    This system implements a state-of-the-art **Recurrent Knowledge Tracing (DKT) Neural Network** in PyTorch,
    directly fulfilling the planned LSTM pipeline from the architectural flowchart.
    """)

    arch_col1, arch_col2 = st.columns([1.2, 1])

    with arch_col1:
        st.code("""
PyTorch DKT_LSTM Architecture:
-------------------------------------------------------------------------------------
1. Concept Embedding:      Embedding(num_concepts=11, embed_dim=32)
2. Correctness Embedding:  Embedding(num_outcomes=2, embed_dim=16)
3. Telemetry Projection:   Linear(3 -> 16) + SiLU + Linear(16 -> 16)
                           [log(1 + time_sec/60), log(1 + attempts), log(1 + elapsed_days)]
4. Layer Normalization:    LayerNorm(input_dim=64) + Dropout(0.2)
5. Recurrent Latent Core:  2-Layer LSTM(input_dim=64, hidden_dim=64, batch_first=True)
                           Encodes student latent knowledge state vector h_t in R^64
6. Prediction Head:        Linear(64 -> 64) -> GELU -> Dropout -> Linear(64 -> 11)
7. Mastery Activation:     Sigmoid(Logits) -> P(Mastery on Concept j at step t+1)
-------------------------------------------------------------------------------------
        """, language="text")

    with arch_col2:
        # Load training metrics if present
        metrics_file = "weights/training_history.json"
        if os.path.exists(metrics_file):
            with open(metrics_file, "r", encoding="utf-8") as f:
                history = json.load(f)
            epochs = [h["epoch"] for h in history]
            train_losses = [h["train_loss"] for h in history]
            val_losses = [h["val_loss"] for h in history]
            val_aucs = [h["val_auc"] for h in history]

            fig_loss = go.Figure()
            fig_loss.add_trace(go.Scatter(x=epochs, y=train_losses, mode="lines+markers", name="Train Loss", line=dict(color="#f87171")))
            fig_loss.add_trace(go.Scatter(x=epochs, y=val_losses, mode="lines+markers", name="Val Loss", line=dict(color="#60a5fa")))
            fig_loss.update_layout(
                title="DKT LSTM Training Convergence",
                paper_bgcolor="rgba(0,0,0,0)",
                plot_bgcolor="rgba(0,0,0,0)",
                font=dict(color="#cbd5e1"),
                xaxis=dict(title="Epoch", gridcolor="rgba(255,255,255,0.1)"),
                yaxis=dict(title="BCE Loss", gridcolor="rgba(255,255,255,0.1)"),
                margin=dict(l=30, r=30, t=40, b=30),
                height=320,
            )
            st.plotly_chart(fig_loss, use_container_width=True)
        else:
            st.info("Train the model using `python train.py` to see convergence curves.")
