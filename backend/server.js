import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Load Datasets Registry
let datasetsRegistry = [];
try {
  const regPath = path.join(__dirname, 'data', 'datasets', 'datasets_registry.json');
  const raw = fs.readFileSync(regPath, 'utf8');
  datasetsRegistry = JSON.parse(raw).datasets;
} catch (e) {
  console.log("Datasets registry loaded from memory fallback.");
}

// In-Memory Database & Initial DKT State
const db = {
  user: {
    name: "Chirag Pradhan",
    registerNo: "24BCE7237",
    email: "chirag.p2024@vitstudent.ac.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    targetRole: "Full Stack AI Engineer",
    dailyGoalMinutes: 45,
    currentStreakDays: 14,
    totalQuestionsSolved: 142,
    overallMastery: 71
  },
  dktState: {
    sequenceLength: 18,
    hiddenStateVector: [0.82, 0.45, 0.12, 0.91, 0.38, 0.76, 0.29, 0.64],
    lastUpdated: new Date().toISOString(),
    topicMasteries: {
      arrays: 0.90,
      strings: 0.85,
      recursion: 0.42,
      trees: 0.65,
      graphs: 0.50,
      dp: 0.35
    }
  },
  topics: [
    { id: "arrays", title: "Arrays & Dynamic Hashing", category: "Data Structures", difficulty: "Beginner", mastery: 90, status: "Strong", totalQuestions: 30, completedQuestions: 27, forgettingRisk: "Low (5%)", color: "#10B981" },
    { id: "strings", title: "Strings & Pattern Matching", category: "Data Structures", difficulty: "Beginner", mastery: 85, status: "Strong", totalQuestions: 25, completedQuestions: 21, forgettingRisk: "Low (8%)", color: "#06B6D4" },
    { id: "recursion", title: "Recursion & Backtracking", category: "Algorithms", difficulty: "Intermediate", mastery: 42, status: "Weak", recommended: true, totalQuestions: 35, completedQuestions: 14, forgettingRisk: "High (68%)", color: "#F43F5E" },
    { id: "trees", title: "Binary Trees & BST Traversal", category: "Data Structures", difficulty: "Intermediate", mastery: 65, status: "Moderate", totalQuestions: 40, completedQuestions: 26, forgettingRisk: "Medium (32%)", color: "#6366F1" },
    { id: "graphs", title: "Graph Algorithms (BFS/DFS)", category: "Algorithms", difficulty: "Advanced", mastery: 50, status: "Moderate", totalQuestions: 30, completedQuestions: 15, forgettingRisk: "Medium (45%)", color: "#A855F7" },
    { id: "dp", title: "Dynamic Programming", category: "Algorithms", difficulty: "Advanced", mastery: 35, status: "Weak", totalQuestions: 45, completedQuestions: 16, forgettingRisk: "High (74%)", color: "#F59E0B" }
  ],
  revisionQueue: [
    { id: "rev-1", topicId: "recursion", topicName: "Recursion & Backtracking", concept: "Base Case Guard Conditions & Memory Leak Prevention", forgettingProbability: 0.68, status: "Overdue", lastReviewed: "6 days ago", nextReviewDue: "Today", recommendedMinutes: 10 },
    { id: "rev-2", topicId: "dp", topicName: "Dynamic Programming", concept: "Top-down Memoization vs Bottom-up Tabulation", forgettingProbability: 0.74, status: "Overdue", lastReviewed: "8 days ago", nextReviewDue: "Today", recommendedMinutes: 15 },
    { id: "rev-3", topicId: "trees", topicName: "Binary Trees", concept: "In-order vs Pre-order Depth First Traversal", forgettingProbability: 0.32, status: "Due Soon", lastReviewed: "3 days ago", nextReviewDue: "Tomorrow", recommendedMinutes: 8 }
  ]
};

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'CogniPath AI REST Server', version: '1.0.0' });
});

// Knowledge Tracing Benchmark Datasets Endpoint
app.get('/api/datasets', (req, res) => {
  res.json({ datasets: datasetsRegistry });
});

// Auth Endpoints
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  if (email) db.user.email = email;
  res.json({ success: true, user: db.user });
});

app.post('/api/auth/register', (req, res) => {
  const { name, registerNo, email, targetRole } = req.body;
  db.user = { ...db.user, name, registerNo, email, targetRole };
  res.json({ success: true, user: db.user });
});

// DKT Machine Learning Engine Endpoint
app.post('/api/dkt/predict', (req, res) => {
  const { topicId, isCorrect, timeTakenSec, hintsUsedCount, attemptsCount } = req.body;

  let baseDelta = isCorrect ? 0.09 : -0.06;
  if (isCorrect && timeTakenSec < 35) baseDelta += 0.04;
  if (hintsUsedCount > 0) baseDelta -= 0.03 * hintsUsedCount;
  if (attemptsCount > 1) baseDelta -= 0.02 * (attemptsCount - 1);

  // Update Topic Mastery
  let updatedMastery = 50;
  db.topics = db.topics.map(t => {
    if (t.id === topicId) {
      const newVal = Math.min(99, Math.max(10, Math.round(t.mastery + baseDelta * 100)));
      updatedMastery = newVal;
      return {
        ...t,
        mastery: newVal,
        status: newVal >= 80 ? 'Strong' : newVal >= 50 ? 'Moderate' : 'Weak',
        completedQuestions: t.completedQuestions + 1,
        forgettingRisk: newVal < 50 ? 'High (65%)' : newVal < 75 ? 'Medium (30%)' : 'Low (5%)'
      };
    }
    return t;
  });

  // Update DKT Sequence & Hidden State Vector
  db.dktState.sequenceLength += 1;
  db.dktState.lastUpdated = new Date().toISOString();
  db.dktState.hiddenStateVector = db.dktState.hiddenStateVector.map(val => 
    Number(Math.min(0.99, Math.max(0.05, val + (isCorrect ? 0.03 : -0.03))).toFixed(2))
  );

  db.user.totalQuestionsSolved += 1;
  db.user.overallMastery = Math.min(99, Math.max(20, db.user.overallMastery + (isCorrect ? 1 : -1)));

  res.json({
    success: true,
    isCorrect,
    masteryChange: Math.round(baseDelta * 100),
    newTopicMastery: updatedMastery,
    dktSequenceLength: db.dktState.sequenceLength,
    hiddenStateVector: db.dktState.hiddenStateVector,
    recommendedNextTopic: db.topics.find(t => t.mastery < 50)?.id || "recursion"
  });
});

// Topics Endpoint
app.get('/api/topics', (req, res) => {
  res.json({ topics: db.topics });
});

// Revision Spaced Repetition Queue Endpoint
app.get('/api/revision', (req, res) => {
  res.json({ revisionItems: db.revisionQueue });
});

// User Profile Endpoint
app.get('/api/user', (req, res) => {
  res.json({ user: db.user, dktState: db.dktState });
});

app.listen(PORT, () => {
  console.log(`CogniPath AI REST Server running on http://localhost:${PORT}`);
});
