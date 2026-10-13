# TODO - CogniPath AI Project Roadmap

## Completed Milestones ✅

- [x] **Project Workspace Reorganization**
  - [x] Separate `frontend/` directory for React 18 + Vite codebase
  - [x] Separate `backend/` directory for Express REST API server
  - [x] Root Markdown documentation (`README.md`, `IMPLEMENTATION_PLAN.md`, `TODO.md`)

- [x] **Knowledge Tracing Datasets Integration**
  - [x] Add dataset registry (`backend/data/datasets/datasets_registry.json`) for 5 datasets: ASSISTments 2009-2010, EdNet, KDD Cup 2010, Statics2011, and CogniPath CS-DKT
  - [x] Add interaction sequence trajectory dataset (`cs_dkt_interactions.json`)
  - [x] Add ASSISTments benchmark sample dataset (`assistments_sample.json`)
  - [x] Expose `GET /api/datasets` endpoint in backend server

- [x] **Frontend 13 Screens Development**
  - [x] Screen 1: Landing Page (Hero, DKT live preview, CTA)
  - [x] Screen 2: Login Page (Credentials form, glassmorphic UI)
  - [x] Screen 3: Register Page (Student signup & ID entry)
  - [x] Screen 4: Learning Setup (3-step onboarding wizard)
  - [x] Screen 5: Dashboard (Mastery progress, AI recommendation banner, weakness alerts)
  - [x] Screen 6: Topic Selection (Search, category filter, topic grid)
  - [x] Screen 7: Question Page (Timer, attempts, syntax code, hint drawer)
  - [x] Screen 8: Result Page (Confetti evaluation, DKT delta update, solution)
  - [x] Screen 9: AI Recommendation Center (DKT dataflow pipeline & parameter tuning)
  - [x] Screen 10: Knowledge Profile (Skill Radar chart & LSTM hidden state trajectory)
  - [x] Screen 11: Progress Analytics (Accuracy trend line chart & daily volume bar chart)
  - [x] Screen 12: Revision Center (Forgetting curve banner & spaced repetition queue)
  - [x] Screen 13: Profile (Academic info, DKT vector reset, theme toggle)

- [x] **Backend API & Engine**
  - [x] Express REST server setup (`/api/health`, `/api/datasets`, `/api/auth`, `/api/dkt/predict`, `/api/topics`, `/api/revision`, `/api/user`)
  - [x] DKT heuristic prediction algorithm evaluating time speed, correctness, and hint penalties

---

## Future Enhancements 🔮

- [ ] Connect Real PyTorch DKT LSTM/GRU Model via Python FastAPI Service
- [ ] Add PDF Report Exporter for Student Progress Summaries
- [ ] Expand Question Bank to include Dynamic Programming Code Execution Sandbox
- [ ] Add Multi-Student Class Benchmark Comparison Leaderboard
