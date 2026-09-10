// Comprehensive Mock Data for CogniPath AI Adaptive Student Platform

export const INITIAL_USER = {
  name: "Chirag Pradhan",
  registerNo: "24BCE7237",
  email: "chirag.p2024@vitstudent.ac.in",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  targetRole: "Full Stack AI Engineer",
  learningStyle: "Visual & Practical Hands-on",
  dailyGoalMinutes: 45,
  currentStreakDays: 14,
  totalQuestionsSolved: 142,
  overallMastery: 71,
  theme: "dark"
};

export const TOPICS = [
  {
    id: "arrays",
    title: "Arrays & Dynamic Hashing",
    category: "Data Structures",
    difficulty: "Beginner",
    mastery: 90,
    status: "Strong",
    totalQuestions: 30,
    completedQuestions: 27,
    forgettingRisk: "Low (5%)",
    color: "#10B981"
  },
  {
    id: "strings",
    title: "Strings & Pattern Matching",
    category: "Data Structures",
    difficulty: "Beginner",
    mastery: 85,
    status: "Strong",
    totalQuestions: 25,
    completedQuestions: 21,
    forgettingRisk: "Low (8%)",
    color: "#06B6D4"
  },
  {
    id: "recursion",
    title: "Recursion & Backtracking",
    category: "Algorithms",
    difficulty: "Intermediate",
    mastery: 42,
    status: "Weak",
    recommended: true,
    totalQuestions: 35,
    completedQuestions: 14,
    forgettingRisk: "High (68%)",
    color: "#F43F5E"
  },
  {
    id: "trees",
    title: "Binary Trees & BST Traversal",
    category: "Data Structures",
    difficulty: "Intermediate",
    mastery: 65,
    status: "Moderate",
    totalQuestions: 40,
    completedQuestions: 26,
    forgettingRisk: "Medium (32%)",
    color: "#6366F1"
  },
  {
    id: "graphs",
    title: "Graph Algorithms (BFS/DFS)",
    category: "Algorithms",
    difficulty: "Advanced",
    mastery: 50,
    status: "Moderate",
    totalQuestions: 30,
    completedQuestions: 15,
    forgettingRisk: "Medium (45%)",
    color: "#A855F7"
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    category: "Algorithms",
    difficulty: "Advanced",
    mastery: 35,
    status: "Weak",
    totalQuestions: 45,
    completedQuestions: 16,
    forgettingRisk: "High (74%)",
    color: "#F59E0B"
  }
];

export const INITIAL_DKT_STATE = {
  sequenceLength: 18,
  lastUpdated: "Just now",
  hiddenStateVector: [0.82, 0.45, 0.12, 0.91, 0.38, 0.76, 0.29, 0.64],
  topicMasteries: {
    arrays: 0.90,
    strings: 0.85,
    recursion: 0.42,
    trees: 0.65,
    graphs: 0.50,
    dp: 0.35
  },
  learningVelocity: "+14% speed boost",
  forgettingAlerts: [
    { topicId: "recursion", message: "Forgetting curve threshold exceeded. Recursion revision suggested.", severity: "high" },
    { topicId: "dp", message: "Time-per-question spikes observed in memoization steps.", severity: "medium" }
  ]
};

export const QUESTIONS_BANK = [
  {
    id: "q-rec-1",
    topicId: "recursion",
    topicName: "Recursion & Backtracking",
    title: "Base Case Identification in Recursive Factorial",
    difficulty: "Easy",
    difficultyLevel: 2,
    codeSnippet: `function factorial(n) {
  // Line 2: What base case prevents stack overflow?
  if (______) return 1;
  return n * factorial(n - 1);
}`,
    questionText: "What condition should replace the blank on line 2 to correctly handle the base case for non-negative integers?",
    options: [
      { id: "A", text: "n <= 1", correct: true },
      { id: "B", text: "n == 0", correct: false },
      { id: "C", text: "n > 1", correct: false },
      { id: "B2", text: "n == 10", correct: false }
    ],
    hint: "Think about what input terminates n * (n-1) * (n-2)... when n reaches 0 or 1.",
    explanation: "For factorial, 0! = 1 and 1! = 1. Checking `n <= 1` handles both 0 and 1 safely, returning 1 without executing further recursive call frames."
  },
  {
    id: "q-rec-2",
    topicId: "recursion",
    topicName: "Recursion & Backtracking",
    title: "Call Stack Depth Traversal",
    difficulty: "Intermediate",
    difficultyLevel: 3,
    codeSnippet: `function printDown(n) {
  if (n <= 0) return;
  console.log(n);
  printDown(n - 1);
}`,
    questionText: "What is the order of printed values when calling printDown(3)?",
    options: [
      { id: "A", text: "3, 2, 1", correct: true },
      { id: "B", text: "1, 2, 3", correct: false },
      { id: "C", text: "3, 3, 3", correct: false },
      { id: "D", text: "0, 1, 2, 3", correct: false }
    ],
    hint: "Notice that console.log occurs BEFORE the recursive call `printDown(n - 1)`.",
    explanation: "Because `console.log(n)` happens pre-recursion (head operation), `3` prints first, then `printDown(2)` prints `2`, then `printDown(1)` prints `1`."
  },
  {
    id: "q-arr-1",
    topicId: "arrays",
    topicName: "Arrays & Dynamic Hashing",
    title: "Two Sum Hash Map Time Complexity",
    difficulty: "Easy",
    difficultyLevel: 1,
    codeSnippet: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
}`,
    questionText: "What is the average time complexity of this Two Sum approach?",
    options: [
      { id: "A", text: "O(O(N)) - Linear Time", correct: true },
      { id: "B", text: "O(N^2) - Quadratic Time", correct: false },
      { id: "C", text: "O(log N) - Logarithmic Time", correct: false },
      { id: "D", text: "O(1) - Constant Time", correct: false }
    ],
    hint: "Map operations `has()` and `set()` take O(1) time on average while iterating through N items once.",
    explanation: "Using a Hash Map allows lookups in average O(1) time. Traversing the array once yields O(N) overall time complexity."
  },
  {
    id: "q-dp-1",
    topicId: "dp",
    topicName: "Dynamic Programming",
    title: "Overlapping Subproblems in Fibonacci",
    difficulty: "Hard",
    difficultyLevel: 4,
    codeSnippet: `// Naive Recursion
fib(n) = fib(n-1) + fib(n-2)

// Memoized DP
memo[n] = memo[n-1] + memo[n-2]`,
    questionText: "How does memoization reduce the time complexity of calculating fib(n) from exponential to linear?",
    options: [
      { id: "A", text: "By storing already calculated subproblem results in O(1) cache lookup", correct: true },
      { id: "B", text: "By eliminating the base case", correct: false },
      { id: "C", text: "By running recursive steps in parallel threads", correct: false },
      { id: "D", text: "By using binary search trees", correct: false }
    ],
    hint: "Memoization avoids re-evaluating nodes in the recursive execution tree.",
    explanation: "Naive fib(n) recalculates fib(2), fib(3) multiple times O(2^N). Storing calculated results guarantees each value 1..N is computed exactly once in O(N) time."
  }
];

export const REVISION_ITEMS = [
  {
    id: "rev-1",
    topicId: "recursion",
    topicName: "Recursion & Backtracking",
    concept: "Base Case Guard Conditions & Memory Leak Prevention",
    forgettingProbability: 0.68,
    status: "Overdue",
    lastReviewed: "6 days ago",
    nextReviewDue: "Today",
    recommendedMinutes: 10
  },
  {
    id: "rev-2",
    topicId: "dp",
    topicName: "Dynamic Programming",
    concept: "Top-down Memoization vs Bottom-up Tabulation",
    forgettingProbability: 0.74,
    status: "Overdue",
    lastReviewed: "8 days ago",
    nextReviewDue: "Today",
    recommendedMinutes: 15
  },
  {
    id: "rev-3",
    topicId: "trees",
    topicName: "Binary Trees",
    concept: "In-order vs Pre-order Depth First Traversal",
    forgettingProbability: 0.32,
    status: "Due Soon",
    lastReviewed: "3 days ago",
    nextReviewDue: "Tomorrow",
    recommendedMinutes: 8
  }
];

export const ANALYTICS_DATA = {
  weeklyAccuracy: [
    { day: "Mon", accuracy: 65, avgTimeSec: 42, attempts: 12 },
    { day: "Tue", accuracy: 70, avgTimeSec: 38, attempts: 18 },
    { day: "Wed", accuracy: 58, avgTimeSec: 55, attempts: 14 },
    { day: "Thu", accuracy: 78, avgTimeSec: 32, attempts: 20 },
    { day: "Fri", accuracy: 82, avgTimeSec: 28, attempts: 22 },
    { day: "Sat", accuracy: 74, avgTimeSec: 35, attempts: 16 },
    { day: "Sun", accuracy: 88, avgTimeSec: 25, attempts: 25 }
  ],
  radarSkillData: [
    { concept: "Arrays", student: 90, benchmark: 75 },
    { concept: "Strings", student: 85, benchmark: 70 },
    { concept: "Recursion", student: 42, benchmark: 80 },
    { concept: "Trees", student: 65, benchmark: 65 },
    { concept: "Graphs", student: 50, benchmark: 60 },
    { concept: "DP", student: 35, benchmark: 70 }
  ],
  hiddenStateTimeline: [
    { attempt: "Q1 (Array)", hiddenVal: 0.50, predictedMastery: 50 },
    { attempt: "Q2 (Array)", hiddenVal: 0.65, predictedMastery: 65 },
    { attempt: "Q3 (Recursion)", hiddenVal: 0.40, predictedMastery: 40 },
    { attempt: "Q4 (Recursion-Fail)", hiddenVal: 0.30, predictedMastery: 30 },
    { attempt: "Q5 (Recursion-Hint)", hiddenVal: 0.42, predictedMastery: 42 },
    { attempt: "Q6 (Tree)", hiddenVal: 0.58, predictedMastery: 58 },
    { attempt: "Q7 (Array-Success)", hiddenVal: 0.71, predictedMastery: 71 }
  ]
};
