"""
Interactive Demo of the Personalized AI Learning System.
Simulates the exact architecture:
Student -> Multi-Topic Diagnostic Questionnaire -> DKT LSTM Model -> Knowledge Profile
-> Weakness ("Why are you weak?"), Forgetting, & Style Detectors -> Personalized Recommendations.
"""
import sys
import time
from engine import PersonalizedAIEngine


def print_banner():
    print("=" * 68)
    print("      PERSONALIZED AI LEARNING ENGINE (DEEP KNOWLEDGE TRACING)")
    print("=" * 68)


def display_dashboard(pipeline_result: dict, engine: PersonalizedAIEngine = None):
    student_name = pipeline_result["student_name"]
    profile = pipeline_result["profile"]
    weaknesses = pipeline_result["weaknesses"]
    forgetting_alerts = pipeline_result["forgetting_alerts"]
    style = pipeline_result["learning_style"]
    rec = pipeline_result["recommendation"]

    print(f"\n[STUDENT]: {student_name} (Simulated Timeline: Day {pipeline_result['current_day']:.1f})")
    print(f"Overall Mastery: {profile.overall_mastery*100:.1f}% | Total Questions Solved: {profile.total_questions_solved} | Accuracy: {profile.overall_accuracy*100:.1f}%")

    print("\n" + "-" * 68)
    print(" 1. TOPIC-WISE ESTIMATED KNOWLEDGE PROFILE (DKT LSTM)")
    print("-" * 68)
    print(f"{'Topic':<24} | {'Mastery':<8} | {'Level':<12} | {'Solved':<7} | {'Accuracy':<8}")
    print("-" * 68)
    for tid, tm in profile.topic_masteries.items():
        bar_len = int(tm.mastery_score * 10)
        bar = "#" * bar_len + "-" * (10 - bar_len)
        acc_str = f"{tm.accuracy_rate*100:.0f}%" if tm.question_count > 0 else "-"
        print(f"{tm.topic_name:<24} | {bar} {tm.mastery_score*100:.0f}% | {tm.mastery_level:<12} | {tm.question_count:<7} | {acc_str:<8}")

    print("\n" + "-" * 68)
    print(" 2. DIAGNOSTIC ANALYTICS & EXPLAINABLE REASONS ('WHY ARE YOU WEAK?')")
    print("-" * 68)
    
    # Weakness
    print("  [Weakness Detection]:")
    if weaknesses:
        for w in weaknesses[:3]:
            print(f"    * [{w.severity}] {w.topic_name}: {w.reason}")
            if engine:
                detailed_reasons = engine.explain_weakness_reasons(w)
                for r in detailed_reasons:
                    print(f"      • {r}")
            print(f"      Suggested Action: {w.suggested_action}")
    else:
        print("    * No critical weaknesses detected. Concept foundation is solid!")

    # Forgetting
    print("\n  [Forgetting Detection (Ebbinghaus Decay)]:")
    if forgetting_alerts:
        for f in forgetting_alerts[:3]:
            print(f"    * [{f.risk_level} RISK] {f.topic_name}: Retention {f.current_retention_rate*100:.0f}% ({f.days_since_practice:.1f} days without practice)")
    else:
        print("    * All practiced topics have healthy retention (>80%).")

    # Learning Style
    print("\n  [Learning Style Detection (AI Learning DNA)]:")
    print(f"    * Archetype: {style.primary_style} (Pace: {style.pace_description}, Attempts: {style.attempt_behavior})")
    print(f"    * Pedagogical Guidance: {style.pedagogical_guidance}")

    print("\n" + "-" * 68)
    print(" 3. PERSONALIZED RECOMMENDATION (NEXT LEARNING PATH)")
    print("-" * 68)
    print(f"  Recommended Next Topic:     {rec.recommended_topic_name}")
    print(f"  Dynamic Difficulty Level:   {rec.recommended_difficulty}")
    print(f"  Pedagogical Rationale:      {rec.reasoning}")
    
    if rec.suggested_questions:
        print("\n  Suggested Practice Questions:")
        for i, q in enumerate(rec.suggested_questions, 1):
            print(f"    {i}. [{q.difficulty}] {q.title} (ID: {q.question_id})")
            print(f"       Description: {q.description}")
            print(f"       Tags: {', '.join(q.tags)}")

    if rec.revision_plan:
        print("\n  Spaced Repetition Revision Plan:")
        for r in rec.revision_plan:
            print(f"    - [{r.priority}] {r.topic_name} ({r.recommended_difficulty}): {r.urgency_reason}")
    print("=" * 68)


def run_diagnostic_questionnaire(engine: PersonalizedAIEngine, student_id: str):
    """
    Runs a multi-topic questionnaire across Arrays, Strings, Recursion, Trees, Graphs, and DP.
    Assesses all concepts together so the DKT model builds an accurate baseline knowledge profile.
    """
    questions = engine.get_diagnostic_assessment_questions(num_per_topic=1)
    print("\n" + "=" * 68)
    print("   STARTING MULTI-TOPIC DIAGNOSTIC QUESTIONNAIRE (ASSESSMENT)")
    print(f"   Total Concepts to Test: {len(questions)} (Arrays, Strings, Recursion, Trees, Graphs, DP)")
    print("=" * 68)
    print("Instructions: Answer each question with A, B, C, or D. Type 'hint' to view a hint.\n")

    answers = []
    option_letters = ["A", "B", "C", "D"]

    for idx, q in enumerate(questions, 1):
        topic_name = engine.topic_names.get(q["topic_id"], q["topic_id"])
        print(f"\n--- [Question {idx}/{len(questions)}] Topic: {topic_name} | Difficulty: {q['difficulty']} ---")
        print(f"Concept: {q.get('concept_tested', q['title'])}")
        print(f"\n{q.get('question_text', q['description'])}\n")

        for opt in q.get("options", []):
            print(f"   {opt}")

        hints_used = 0
        attempts = 1
        t_start = time.time()

        while True:
            raw_ans = input("\nYour answer [A/B/C/D] (or 'hint'): ").strip().upper()
            if raw_ans == "HINT":
                hints_used += 1
                print(f"💡 HINT: {q.get('hint', 'Think carefully about time and space constraints.')}")
                continue

            if raw_ans in option_letters:
                user_idx = option_letters.index(raw_ans)
                correct_idx = q.get("correct_index", 0)
                is_correct = 1 if user_idx == correct_idx else 0
                t_spent = max(15.0, round(time.time() - t_start, 1))

                if is_correct:
                    print("✅ Correct!")
                else:
                    correct_letter = option_letters[correct_idx]
                    print(f"❌ Incorrect. (Correct Answer was {correct_letter})")
                    attempts = 2

                print(f"Explanation: {q.get('explanation', '')}")

                answers.append({
                    "question_id": q["id"],
                    "correct": is_correct,
                    "time_taken_sec": t_spent,
                    "attempts": attempts,
                    "days_advanced": 0.2,
                })
                break
            else:
                print("Please enter A, B, C, or D (or 'hint').")

    print("\n" + "=" * 68)
    print("Diagnostic Questionnaire Completed! Submitting multi-concept sequence to DKT LSTM...")
    print("=" * 68)
    engine.record_questionnaire_results(student_id, answers)
    print("Deep Learning model updated successfully across all concepts!\n")


def solve_single_question(q: dict, engine: PersonalizedAIEngine, student_id: str, header_label: str = "Recommended Practice"):
    """
    Interactively presents an MCQ question, accepts option [A/B/C/D] or hint,
    measures elapsed time automatically, evaluates correctness, and records the telemetry
    without requiring manual self-reporting or manual stat editing.
    """
    option_letters = ["A", "B", "C", "D"]
    topic_name = engine.topic_names.get(q.get("topic_id"), q.get("topic_id", "General"))
    print("\n" + "=" * 68)
    print(f"   {header_label.upper()}: [{q.get('difficulty', 'Medium')}] {q.get('title', '')}")
    print(f"   Topic: {topic_name} | Concept: {q.get('concept_tested', q.get('title', ''))}")
    print("=" * 68)
    print(f"\n{q.get('question_text', q.get('description', ''))}\n")

    options = q.get("options", [])
    if options:
        for opt in options:
            print(f"   {opt}")
    else:
        print("   A. True / Optimal\n   B. False / Suboptimal")

    num_opts = len(options) if options else 2
    valid_letters = option_letters[:num_opts]
    prompt_str = "/".join(valid_letters)

    hints_used = 0
    attempts = 1
    t_start = time.time()

    while True:
        raw_ans = input(f"\nYour answer [{prompt_str}] (or 'hint'): ").strip().upper()
        if raw_ans == "HINT":
            hints_used += 1
            print(f"💡 HINT: {q.get('hint', 'Analyze time complexity and optimal data structures.')}")
            continue

        if raw_ans in valid_letters:
            user_idx = option_letters.index(raw_ans)
            correct_idx = q.get("correct_index", 0)
            is_correct = 1 if user_idx == correct_idx else 0
            t_spent = max(10.0, round(time.time() - t_start, 1))

            if is_correct:
                print("\n✅ Correct! Great job.")
            else:
                correct_letter = option_letters[correct_idx]
                print(f"\n❌ Incorrect. (Correct Answer was {correct_letter})")
                attempts = 2

            if q.get("explanation"):
                print(f"Explanation: {q['explanation']}")

            print(f"Time spent: {t_spent:.1f}s | Attempts: {attempts}")

            engine.record_interaction(
                student_id=student_id,
                question_id=q["id"],
                correct=is_correct,
                time_taken_sec=t_spent,
                attempts=attempts,
                days_advanced=0.5,
            )
            print("Interaction saved! Deep Learning Model and Knowledge Profile updated.\n")
            break
        else:
            print(f"Please enter one of [{prompt_str}] (or 'hint').")


def run_interactive():
    print_banner()
    engine = PersonalizedAIEngine(
        taxonomy_path="data/dsa_taxonomy.json",
        weights_path="weights/dkt_lstm.pt",
        db_path="data/demo_students.json",
    )

    student_id = input("\nEnter Student ID / Username [default: alex_coder]: ").strip() or "alex_coder"
    student = engine.get_or_create_student(student_id, student_name=student_id.capitalize())

    while True:
        res = engine.run_full_pipeline(student_id)
        display_dashboard(res, engine=engine)

        print("\nOPTIONS:")
        print(" [1] Take Multi-Topic Diagnostic Assessment (Tests Arrays, Strings, Recursion, Trees, DP at once)")
        print(" [2] Solve a recommended question (Targeted adaptive practice)")
        print(" [3] Solve any question by ID")
        print(" [4] Fast-forward time (Simulate days elapsed to test Forgetting curve)")
        print(" [5] Load Scenario: Student A (Strong Arrays/Strings, Weak Recursion/DP - 70% overall)")
        print(" [6] Load Scenario: Student B (Weak Arrays/Strings, Strong Recursion/Trees - 70% overall)")
        print(" [7] Retrain / Fine-tune Model (Continually train on dynamically updated dataset)")
        print(" [0] Exit")

        choice = input("\nSelect option [1/2/3/4/5/6/7/0]: ").strip()

        if choice == "0":
            print("\nExiting. Happy learning!")
            break

        elif choice == "1":
            run_diagnostic_questionnaire(engine, student_id)

        elif choice == "2":
            rec = res["recommendation"]
            if not rec.suggested_questions:
                print("No pending questions available in this category.")
                continue
            q_rec = rec.suggested_questions[0]
            q = engine.question_lookup.get(q_rec.question_id)
            if not q:
                print("Question not found in taxonomy.")
                continue
            solve_single_question(q, engine, student_id, header_label="Recommended Practice")

        elif choice == "3":
            print("\nAvailable Questions by Topic:")
            print("  [arrays]    q_arr_01 (Two Sum, Easy), q_arr_02 (Stock, Easy), q_arr_03 (Product, Med), q_arr_04 (Water, Hard)")
            print("  [strings]   q_str_01 (Palindrome, Easy), q_str_02 (Substring, Med), q_str_03 (Window, Hard)")
            print("  [recursion] q_rec_01 (Fibonacci, Easy), q_rec_02 (Subsets, Med), q_rec_03 (N-Queens, Hard)")
            print("  [trees]     q_tree_01 (Max Depth, Easy), q_tree_02 (Invert, Easy), q_tree_03 (LCA, Med), q_tree_04 (Path Sum, Hard)")
            print("  [graphs]    q_graph_01 (Islands, Med), q_graph_02 (Course Schedule, Med), q_graph_03 (Word Ladder, Hard)")
            print("  [dp]        q_dp_01 (Climbing Stairs, Easy), q_dp_02 (Coin Change, Med), q_dp_03 (LIS, Med), q_dp_04 (Edit Dist, Hard)")
            
            q_id = input("\nEnter Question ID (e.g., q_rec_01, q_dp_01, q_arr_01): ").strip()
            if q_id not in engine.question_lookup:
                print(f"Unknown question ID '{q_id}'. Please pick an ID from the list above.")
                continue
            q = engine.question_lookup[q_id]
            solve_single_question(q, engine, student_id, header_label="Targeted Question Practice")

        elif choice == "4":
            print("\n" + "=" * 68)
            print("   EBBINGHAUS FORGETTING CURVE SIMULATION (TEMPORAL FAST-FORWARD)")
            print("   Simulate days elapsed without practice to test memory decay & revision")
            print("=" * 68)
            current_day = student.get("current_day", 0.0)
            print(f"Current Student Timeline: Day {current_day:.1f}")
            days_str = input("Enter number of days to fast-forward (e.g., 7, 14, 30) [default: 14]: ").strip()
            days = float(days_str) if days_str else 14.0
            student["current_day"] = round(current_day + days, 2)
            engine._save_student_store()
            print(f"\n⏩ Advanced time by {days:.1f} days! Timeline is now Day {student['current_day']:.1f}.")
            print("Review Section 2 [Forgetting Detection] and Section 3 [Revision Plan] on the dashboard!")

        elif choice == "5":
            print("\nLoading Preset: Student A (Strong Arrays/Strings, Weak Recursion/DP)...")
            engine.seed_student_profile_preset(student_id, preset="student_a")
            print("Student A loaded! Notice how overall score is ~70%, but Recursion & DP are weak.")

        elif choice == "6":
            print("\nLoading Preset: Student B (Weak Arrays/Strings, Strong Recursion/Trees)...")
            engine.seed_student_profile_preset(student_id, preset="student_b")
            print("Student B loaded! Notice how overall score is ~70%, but Arrays & Strings are weak.")

        elif choice == "7":
            print("\n" + "=" * 68)
            print("DYNAMIC RETRAINING & CONTINUAL LEARNING")
            print("=" * 68)
            print("1. Syncing all newly recorded interactions to data/psv/cognipath_cs_dkt.psv...")
            print("2. Starting continual fine-tuning of LSTM weights on the updated dataset...")
            epochs_input = input("Enter number of fine-tuning epochs [default: 5]: ").strip()
            num_epochs = int(epochs_input) if epochs_input.isdigit() else 5
            try:
                w_path = engine.retrain_model(epochs=num_epochs, incremental=True)
                print(f"\n✅ Retraining complete! Model weights updated at {w_path}.")
                print("The active session in memory has been reloaded with the newly updated model!\n")
            except Exception as e:
                print(f"❌ Retraining encountered an issue: {e}")


if __name__ == "__main__":
    run_interactive()
