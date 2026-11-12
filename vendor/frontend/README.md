# Personalized Learning AI — Adaptive DSA Learning

Personalized Learning AI is an adaptive learning frontend application engineered for Data Structures & Algorithms (DSA). This repository contains the college project frontend built with React, TypeScript, Vite, Tailwind CSS, and React Router.

---

## Technology Stack

- **Core Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7 (`BrowserRouter`)
- **Theme Support**: Light theme by default with persistent dark mode toggle (`ThemeContext`)

---

## Project Structure

```
DL PROJECT/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── icons/          # Lightweight, typed SVG icons (Sun, Moon, Brain, etc.)
│   │   ├── layout/         # Shared application layout (Navbar, Footer, AppLayout)
│   │   └── ui/             # Reusable UI component library (Button, Card, Badge, Input, Select, ThemeToggle)
│   ├── context/            # Light/Dark ThemeProvider & DemoLearningProvider state
│   ├── data/               # Static domain data (7 DSA categories, 11 screens metadata, centralized question bank)
│   ├── pages/              # Screen components
│   │   ├── LandingPage.tsx           # Project overview, DSA scope, roadmap & component verification
│   │   ├── LoginPage.tsx             # Student sign-in with client validation & demo session
│   │   ├── RegisterPage.tsx          # Student registration with academic profile preferences
│   │   ├── LearningSetupPage.tsx     # Initial DSA topic, learning goal, difficulty calibration
│   │   ├── DashboardPage.tsx         # Student learning overview, topic progress, direct practice links
│   │   ├── DSATopicsPage.tsx         # The 7 DSA topic categories, curriculum explorer, practice actions
│   │   ├── PracticeQuestionsPage.tsx # Topic-tailored questions, live timer, validation, option selection
│   │   ├── AnswerResultPage.tsx      # Instant evaluation, answer comparison, explanations, attempt telemetry
│   │   └── NotFoundPage.tsx          # 404 error page with recovery navigation
│   ├── router/             # React Router route declarations
│   ├── types/              # Domain TypeScript types & interfaces
│   ├── utils/              # Helper utilities (cn classname merger)
│   ├── App.tsx             # Root component with ThemeProvider, DemoLearningProvider & AppRouter
│   ├── index.css           # Tailwind CSS imports & theme definitions
│   └── main.tsx            # Application entry point
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vite.config.ts
└── README.md
```

---

## Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Starts the Vite local dev server (default: `http://localhost:5173/`).

### 3. Build for Production
```bash
npm run build
```
Runs TypeScript verification (`tsc -b`) and Vite production bundle generation (`vite build`). Output is created in `dist/`.

### 4. Preview Production Build
```bash
npm run preview
```
Serves the generated `dist/` production assets locally.

### 5. Run Linter
```bash
npm run lint
```
Lints all TypeScript and React files with 0 errors and 0 warnings.

---

## Project Scope

### 1. Exactly 11 Screens (Across Milestones)
1. **Landing** *(Active - Milestone A)*
2. **Login** *(Active - Milestone B Part 1)*
3. **Register** *(Active - Milestone B Part 1)*
4. **Learning Setup** *(Active - Milestone B Part 2)*
5. **Dashboard** *(Active - Milestone B Part 2)*
6. **DSA Topics** *(Active - Milestone B Part 2)*
7. **Practice Questions** *(Active - Milestone C Part 1)*
8. **Answer Result** *(Active - Milestone C Part 1)*
9. **Knowledge Profile** *(Planned for Milestone C Part 2)*
10. **Recommendations and Revision** *(Planned for Milestone C Part 2)*
11. **Profile and Settings** *(Planned for Milestone C Part 2)*

### 2. DSA Topic Focus
- Arrays and Strings
- Searching
- Sorting
- Linked Lists
- Stacks and Queues
- Recursion
- Trees

### 3. Preserved Learning Workflow Loop
1. Student Answers Questions
2. Activity is Recorded
3. Knowledge Profile is Updated
4. Weakness, Forgetting and Learning-Behavior Analysis
5. Topic, Difficulty and Revision Recommendations
6. Student Practices Again

---

## Milestone Deliverables Summary

### Milestone A: Frontend Foundation
- [x] Fresh project initialized with Vite + React + TypeScript + Tailwind CSS.
- [x] Application routing configured with React Router v7.
- [x] Shared layout created (`AppLayout`, `Navbar`, `Footer`).
- [x] Design system and reusable UI components established (`Button`, `Card`, `Badge`, `Input`, `Select`, `ThemeToggle`).
- [x] Light/Dark theme foundation implemented (light by default with persistent dark mode toggle).
- [x] Clear folder structure for pages, components, types, data, and utilities.
- [x] Temporary landing page showcasing project scope, DSA curriculum, and UI components.
- [x] Dedicated 404 Not Found page with return navigation.
- [x] Production build and lint verified (`npm run build` and `npm run lint` succeed with 0 errors).

### Milestone B (Part 1): Login & Register Screens
- [x] Functional `LoginPage` (`/login`) with client-side validation and simulated demo session.
- [x] Functional `RegisterPage` (`/register`) with name, email, academic level select, password confirmation, and honor code consent.
- [x] Bidirectional navigation between Landing (`/`), Login (`/login`), and Register (`/register`).
- [x] Zero backend/database connections; explicit demo-only disclaimers prominently displayed.
- [x] Zero real passwords stored in localStorage or persistent browser storage.
- [x] Convenient "Quick-Fill Demo" buttons provided on both forms for evaluation.
- [x] Production build and lint verified with 0 errors and 0 warnings.

### Milestone B (Part 2): Learning Setup, Dashboard & DSA Topics
- [x] Functional `LearningSetupPage` (`/setup`):
  - Introduces student to adaptive DSA learning methodology.
  - Interactive selection of initial focus topic from the 7 DSA categories.
  - Selection of learning goal (Interview Prep, Mastery, Exams, Revisit).
  - Difficulty level calibration (Easy, Medium, Hard) and daily question target.
  - Client-side validation, error messages, and "Quick-Fill Demo Defaults" option.
  - Working "Save Preferences & Continue" action routing directly to Dashboard.
- [x] Functional `DashboardPage` (`/dashboard`):
  - Student learning overview with current focus topic, active goal, and calibrated difficulty.
  - Recommended next action card using clearly labelled simulated demo data.
  - Progress table & visual completion meters for all 7 DSA topic categories.
  - Working direct navigation to DSA Topics (`/topics`) and Learning Setup (`/setup`).
- [x] Functional `DSATopicsPage` (`/topics`):
  - Exactly 7 DSA category cards: Arrays & Strings, Searching, Sorting, Linked Lists, Stacks & Queues, Recursion, Trees.
  - Real-time search filter by topic name or concept keyword.
  - Deep-link focus support via URL query string (`/topics?focus=Searching`).
  - Working "Set as Active Focus" action updating centralized demo state with transient feedback.
  - Direct "Practice" buttons navigating to Screen 7.

### Milestone C (Part 1): Practice Questions & Answer Result
- [x] Centralized, typed DSA demo question bank (`src/data/dsaQuestions.ts`):
  - Comprehensive question collection with standardized question IDs (e.g., `AS-EASY-01`, `AS-MED-01`, `AS-HARD-01`).
  - Focuses heavily on Arrays and Strings across Easy, Medium, and Hard difficulties, with structured questions covering the other 6 categories.
  - Code snippets, multiple-choice options, correct option IDs, step-by-step explanations, key takeaways, and target time budgets.
- [x] Screen 7: `PracticeQuestionsPage` (`/practice`):
  - Topic pill selector for all 7 DSA categories, synchronized with URL query params (`?topic=...`).
  - Difficulty filter (All, Easy, Medium, Hard).
  - Running elapsed stopwatch measuring student latency in seconds.
  - Question roster / jump palette for direct question jumping.
  - Code snippet display with monospace syntax formatting.
  - Accessible, keyboard-navigable answer options (`role="radiogroup"`, `role="radio"`).
  - Validation preventing empty or accidental submissions.
  - Telemetry logging: calls `recordSubmission()` to record attempt count, question ID, latency, and correctness in centralized demo state.
- [x] Screen 8: `AnswerResultPage` (`/result`):
  - Displays instant evaluation banner (Correct vs Needs Revision).
  - Compares student's submitted option with the verified correct solution.
  - Detailed step-by-step conceptual explanation and per-option failure rationale.
  - Key algorithmic takeaway card.
  - Attempt telemetry summary (latency, attempt number, question ID).
  - Working actions: "Next Practice Question", "Try Question Again", "Return to Dashboard", "View All Topics".
- [x] End-to-end integration:
  - Dashboard and DSA Topics screens link directly into Practice Questions.
  - Navbar includes active Practice link.
  - Theme compatibility (Light & Dark) across all 8 active screens.
  - Production build and lint verified with 0 errors and 0 warnings.

