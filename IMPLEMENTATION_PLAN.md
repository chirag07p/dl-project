# IMPLEMENTATION PLAN - CogniPath AI Platform

## 1. Architectural Overview
CogniPath AI is built as a decoupled full-stack platform consisting of:
1. **Frontend**: React 18 + Vite SPA using Lucide Icons, Recharts, and custom CSS design tokens.
2. **Backend**: Express REST API server simulating Deep Knowledge Tracing (DKT) recurrent state updates.
3. **Core Engine**: LSTM/GRU sequence modeling heuristic tracking response duration, attempts, correctness, and hint penalties.
4. **Knowledge Tracing Datasets**: Integrated datasets (ASSISTments 2009-2010, EdNet, KDD Cup 2010, Statics2011, and CogniPath CS-DKT) located in `backend/data/datasets/`.

## 2. Directory Layout
- `frontend/`: Contains all client UI views (13 distinct pages), state context providers, and design system styling.
- `backend/`: Server application presenting REST endpoints for authentication, DKT vector inference, topic catalogues, analytics, spaced repetition queues, and dataset registry (`/api/datasets`).
- `backend/data/datasets/`:
  - `datasets_registry.json`: Metadata for 5 benchmark DKT datasets.
  - `cs_dkt_interactions.json`: Computer Science interaction sequences (Arrays, Strings, Recursion, Trees, Graphs, DP).
  - `assistments_sample.json`: ASSISTments 2009-2010 benchmark sample records.

## 3. Data Flow & DKT Algorithm
- **Inputs**: `(user_id, question_id, topic_id, is_correct, time_taken_sec, attempts_count, hints_used_count)`
- **Calculation**:
  $$\text{Delta} = \text{baseDelta} + \text{timeBonus} - \text{hintPenalty} - \text{attemptPenalty}$$
- **State Updates**:
  - Topic mastery updated in range $[10\%, 99\%]$
  - Recurrent hidden state vector updated (8-dimensional representation)
  - Sequence length incremented
  - Next adaptive recommendation generated

## 4. Screen Component Mapping
- `LandingPage.jsx`: Screen 1 (Hero & DKT Feed Widget)
- `LoginPage.jsx`: Screen 2 (Authentication)
- `RegisterPage.jsx`: Screen 3 (Onboarding Form)
- `LearningSetupPage.jsx`: Screen 4 (Setup Wizard)
- `DashboardPage.jsx`: Screen 5 (Student Dashboard)
- `TopicSelectionPage.jsx`: Screen 6 (Topic Catalogue)
- `QuestionPage.jsx`: Screen 7 (Focus Quiz Engine)
- `ResultPage.jsx`: Screen 8 (Evaluation & Delta Summary)
- `AIRecommendationPage.jsx`: Screen 9 (Pipeline Visualization)
- `KnowledgeProfilePage.jsx`: Screen 10 (Radar Chart & Matrix)
- `ProgressAnalyticsPage.jsx`: Screen 11 (Accuracy & Volume Trends)
- `RevisionCenterPage.jsx`: Screen 12 (Spaced Repetition Queue)
- `ProfilePage.jsx`: Screen 13 (User Profile & System Settings)
