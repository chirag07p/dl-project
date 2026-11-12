import type {
  DSATopicInfo,
  DSATopicCategory,
  ScreenDefinition,
  WorkflowStage,
  LearningSetupPreferences,
  TopicProgressSummary,
  LearningGoal,
} from '../types';

export interface DSATopicDetailedInfo extends DSATopicInfo {
  sampleConcepts: string[];
  recommendedPrerequisite: string;
}

export const DSA_TOPICS: DSATopicDetailedInfo[] = [
  {
    id: 'arrays-strings',
    name: 'Arrays and Strings',
    slug: 'arrays-and-strings',
    description: 'Fundamental linear sequences, multi-dimensional buffers, two-pointer traversals, and string manipulations.',
    estimatedConcepts: 8,
    sampleConcepts: [
      'Static & Dynamic Arrays',
      'Two-Pointer Technique',
      'Sliding Window Patterns',
      'Prefix & Suffix Sums',
      'String Tokenization & Reversal',
      'In-place Array Modifications',
      'Substring Hashing & Rolling Hash',
      "Kadane's Subarray Optimization",
    ],
    recommendedPrerequisite: 'Basic Programming Syntax & Loops',
  },
  {
    id: 'searching',
    name: 'Searching',
    slug: 'searching',
    description: 'Linear search, binary search variations, search-space reduction, and order-statistic techniques.',
    estimatedConcepts: 6,
    sampleConcepts: [
      'Linear Search Bounds',
      'Binary Search on Sorted Arrays',
      'Search in Rotated Sorted Arrays',
      'Lower & Upper Bound Detection',
      'Binary Search on Answer Range',
      'Ternary & Peak Element Search',
    ],
    recommendedPrerequisite: 'Arrays & Loop Invariants',
  },
  {
    id: 'sorting',
    name: 'Sorting',
    slug: 'sorting',
    description: 'Comparison-based sorting (Merge Sort, Quick Sort), in-place partitioning, and stability properties.',
    estimatedConcepts: 7,
    sampleConcepts: [
      'Selection & Insertion Sort',
      'Merge Sort & Divide and Conquer',
      'Quick Sort & Hoare/Lomuto Partition',
      'Counting & Radix Sort (Non-comparison)',
      'Cyclic Sort Technique',
      'Inversion Count Logic',
      'Custom Comparator Ordering',
    ],
    recommendedPrerequisite: 'Arrays & Recursion Basics',
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    slug: 'linked-lists',
    description: 'Singly, doubly, and circular linked nodes, cycle detection, pointer reversals, and merge operations.',
    estimatedConcepts: 6,
    sampleConcepts: [
      'Singly & Doubly Linked Structures',
      'Sentinel & Dummy Node Idioms',
      'In-place List Reversal',
      "Fast & Slow Pointers (Floyd's Cycle)",
      'Merging Two Sorted Linked Lists',
      'LRU Cache Node Splices',
    ],
    recommendedPrerequisite: 'Memory Pointers & Reference Objects',
  },
  {
    id: 'stacks-queues',
    name: 'Stacks and Queues',
    slug: 'stacks-and-queues',
    description: 'LIFO & FIFO primitives, monotonic structures, circular buffers, and expression evaluations.',
    estimatedConcepts: 7,
    sampleConcepts: [
      'Array & Node-based Stack/Queue',
      'Valid Parentheses Matching',
      'Min Stack in O(1) Auxiliary Space',
      'Monotonic Increasing/Decreasing Stacks',
      'Circular Queue Ring Buffers',
      'Sliding Window Maximum via Deque',
      'Infix to Postfix Evaluation',
    ],
    recommendedPrerequisite: 'Arrays & Linked Lists',
  },
  {
    id: 'recursion',
    name: 'Recursion',
    slug: 'recursion',
    description: 'Base cases, call stack dynamics, divide-and-conquer mechanics, and backtracking exploration.',
    estimatedConcepts: 6,
    sampleConcepts: [
      'Base Case Formulation & Call Stacks',
      'Recurrence Relations & Master Theorem',
      'Subset & Combination Generation',
      'Permutation Traversal Trees',
      'Backtracking State Pruning',
      'Memoization Foundations',
    ],
    recommendedPrerequisite: 'Mathematical Induction & Functions',
  },
  {
    id: 'trees',
    name: 'Trees',
    slug: 'trees',
    description: 'Binary trees, binary search trees (BST), depth-first & breadth-first traversals, and tree balance.',
    estimatedConcepts: 8,
    sampleConcepts: [
      'Binary Tree Representation',
      'DFS: Inorder, Preorder, Postorder',
      'BFS: Level-Order Traversal with Queue',
      'Binary Search Tree (BST) Invariants',
      'Lowest Common Ancestor (LCA)',
      'Tree Height & Diameter Calculation',
      'Balanced Tree Check (AVL/Height)',
      'Subtree Validation & Serialization',
    ],
    recommendedPrerequisite: 'Recursion & Stacks/Queues',
  },
];

export const APP_SCREENS: ScreenDefinition[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    route: '/',
    stepNumber: 1,
    description: 'Project introduction, architecture overview, and entry point.',
    plannedMilestone: 'A',
    status: 'active',
  },
  {
    id: 'login',
    name: 'Login',
    route: '/login',
    stepNumber: 2,
    description: 'Student authentication credentials input with client-side validation and simulated demo session.',
    plannedMilestone: 'B',
    status: 'active',
  },
  {
    id: 'register',
    name: 'Register',
    route: '/register',
    stepNumber: 3,
    description: 'New learner account registration with academic profile preferences.',
    plannedMilestone: 'B',
    status: 'active',
  },
  {
    id: 'learning-setup',
    name: 'Learning Setup',
    route: '/setup',
    stepNumber: 4,
    description: 'Initial learning baseline, target topic focus, and study preferences.',
    plannedMilestone: 'B',
    status: 'active',
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
    stepNumber: 5,
    description: 'Central learner overview, session history, and quick access to topics.',
    plannedMilestone: 'B',
    status: 'active',
  },
  {
    id: 'dsa-topics',
    name: 'DSA Topics',
    route: '/topics',
    stepNumber: 6,
    description: 'Comprehensive catalogue of the 7 DSA topic categories.',
    plannedMilestone: 'B',
    status: 'active',
  },
  {
    id: 'practice-questions',
    name: 'Practice Questions',
    route: '/practice',
    stepNumber: 7,
    description: 'Topic-tailored questions with code editor or answer choice interface.',
    plannedMilestone: 'C',
    status: 'active',
  },
  {
    id: 'answer-result',
    name: 'Answer Result',
    route: '/result',
    stepNumber: 8,
    description: 'Instant verification, test case results, and step-by-step conceptual explanation.',
    plannedMilestone: 'C',
    status: 'active',
  },
  {
    id: 'knowledge-profile',
    name: 'Knowledge Profile',
    route: '/knowledge-profile',
    stepNumber: 9,
    description: 'Multi-topic mastery representation, retention assessment, and topic competency radar.',
    plannedMilestone: 'C',
    status: 'planned',
  },
  {
    id: 'recommendations-revision',
    name: 'Recommendations and Revision',
    route: '/recommendations',
    stepNumber: 10,
    description: 'Data-driven revision queue, spaced repetition targets, and next recommended challenges.',
    plannedMilestone: 'C',
    status: 'planned',
  },
  {
    id: 'profile-settings',
    name: 'Profile and Settings',
    route: '/settings',
    stepNumber: 11,
    description: 'Account settings, theme preference, and learning configuration.',
    plannedMilestone: 'C',
    status: 'planned',
  },
];

export const LEARNING_WORKFLOW_STAGES: WorkflowStage[] = [
  {
    step: 1,
    title: 'Student Answers Questions',
    description: 'Learner engages with focused DSA challenges across chosen concepts and difficulty levels.',
  },
  {
    step: 2,
    title: 'Activity is Recorded',
    description: 'Timing, submission correctness, attempts, and error patterns are logged into the session state.',
  },
  {
    step: 3,
    title: 'Knowledge Profile is Updated',
    description: 'Topic proficiency vectors and mastery scores reflect recent performance adjustments.',
  },
  {
    step: 4,
    title: 'Weakness, Forgetting & Behavior Analysis',
    description: 'Cognitive decay and concept confusion indicators are evaluated against knowledge state.',
  },
  {
    step: 5,
    title: 'Topic, Difficulty & Revision Recommendations',
    description: 'Adaptive scheduling selects high-yield revision topics and appropriate difficulty progressions.',
  },
  {
    step: 6,
    title: 'Student Practices Again',
    description: 'Closed-loop cycle reinforces retention and addresses discovered knowledge gaps.',
  },
];

export const LEARNING_GOALS_OPTIONS: {
  id: LearningGoal;
  title: string;
  description: string;
  iconName: string;
}[] = [
  {
    id: 'College Coursework & Exams',
    title: 'College Coursework & Exams',
    description: 'Structured topic coverage aligned with university semester DSA curriculum and lab assignments.',
    iconName: 'book',
  },
  {
    id: 'Interview Preparation',
    title: 'Interview Preparation',
    description: 'High-frequency algorithmic problem patterns, asymptotic optimization, and coding rounds.',
    iconName: 'code',
  },
  {
    id: 'Foundations & Problem Solving',
    title: 'Foundations & Problem Solving',
    description: 'Step-by-step intuitive mastery starting with basic sequences before advanced trees.',
    iconName: 'compass',
  },
  {
    id: 'Rapid Revision & Spaced Practice',
    title: 'Rapid Revision & Spaced Practice',
    description: 'Fast refresher focusing on weak areas, key recurrence patterns, and core algorithms.',
    iconName: 'sparkles',
  },
];

export const DEFAULT_LEARNING_PREFERENCES: LearningSetupPreferences = {
  initialTopic: 'Arrays and Strings',
  learningGoal: 'College Coursework & Exams',
  preferredDifficulty: 'Medium',
  dailyTargetQuestions: 5,
  lastUpdated: new Date().toLocaleDateString(),
};

export const DEFAULT_TOPIC_PROGRESS: TopicProgressSummary[] = [
  {
    topic: 'Arrays and Strings',
    slug: 'arrays-and-strings',
    status: 'In Progress',
    completedConcepts: 3,
    totalConcepts: 8,
    sampleConcepts: ['Static & Dynamic Arrays', 'Two-Pointer Technique', 'Prefix & Suffix Sums'],
  },
  {
    topic: 'Searching',
    slug: 'searching',
    status: 'Up Next',
    completedConcepts: 1,
    totalConcepts: 6,
    sampleConcepts: ['Binary Search on Sorted Arrays'],
  },
  {
    topic: 'Sorting',
    slug: 'sorting',
    status: 'Up Next',
    completedConcepts: 1,
    totalConcepts: 7,
    sampleConcepts: ['Merge Sort & Divide and Conquer'],
  },
  {
    topic: 'Linked Lists',
    slug: 'linked-lists',
    status: 'Queued',
    completedConcepts: 0,
    totalConcepts: 6,
    sampleConcepts: [],
  },
  {
    topic: 'Stacks and Queues',
    slug: 'stacks-and-queues',
    status: 'Queued',
    completedConcepts: 0,
    totalConcepts: 7,
    sampleConcepts: [],
  },
  {
    topic: 'Recursion',
    slug: 'recursion',
    status: 'Queued',
    completedConcepts: 0,
    totalConcepts: 6,
    sampleConcepts: [],
  },
  {
    topic: 'Trees',
    slug: 'trees',
    status: 'Queued',
    completedConcepts: 0,
    totalConcepts: 8,
    sampleConcepts: [],
  },
];

/**
 * Maps granular question subconcepts to unique canonical curriculum concepts.
 * Ensures completedConcepts tracks unique concept mastery, not duplicate questions.
 */
export const getCanonicalConcept = (subconcept: string, topic: DSATopicCategory): string => {
  const sub = subconcept.toLowerCase();

  if (topic === 'Arrays and Strings') {
    if (sub.includes('two-pointer') || sub.includes('two pointer') || sub.includes('trapping rain')) {
      return 'Two-Pointer Technique';
    }
    if (sub.includes('prefix') || sub.includes('suffix')) {
      return 'Prefix & Suffix Sums';
    }
    if (sub.includes('sliding window')) {
      return 'Sliding Window Patterns';
    }
    if (sub.includes('reversal') || sub.includes('in-place')) {
      return 'In-place Array Modifications';
    }
    if (sub.includes('kadane')) {
      return "Kadane's Subarray Optimization";
    }
    if (sub.includes('hash') || sub.includes('substring')) {
      return 'Substring Hashing & Rolling Hash';
    }
    if (sub.includes('array')) {
      return 'Static & Dynamic Arrays';
    }
  } else if (topic === 'Searching') {
    if (sub.includes('rotated')) {
      return 'Search in Rotated Sorted Arrays';
    }
    if (sub.includes('binary search') || sub.includes('lower bound')) {
      return 'Binary Search on Sorted Arrays';
    }
    if (sub.includes('linear')) {
      return 'Linear Search Bounds';
    }
    if (sub.includes('answer range')) {
      return 'Binary Search on Answer Range';
    }
    if (sub.includes('peak') || sub.includes('ternary')) {
      return 'Ternary & Peak Element Search';
    }
  } else if (topic === 'Sorting') {
    if (sub.includes('merge')) {
      return 'Merge Sort & Divide and Conquer';
    }
    if (sub.includes('quick')) {
      return 'Quick Sort & Hoare/Lomuto Partition';
    }
    if (sub.includes('selection') || sub.includes('insertion')) {
      return 'Selection & Insertion Sort';
    }
    if (sub.includes('cyclic')) {
      return 'Cyclic Sort Technique';
    }
  } else if (topic === 'Linked Lists') {
    if (sub.includes('cycle') || sub.includes('slow') || sub.includes('fast')) {
      return "Fast & Slow Pointers (Floyd's Cycle)";
    }
    if (sub.includes('reversal')) {
      return 'In-place List Reversal';
    }
    if (sub.includes('sentinel') || sub.includes('dummy')) {
      return 'Sentinel & Dummy Node Idioms';
    }
    if (sub.includes('merge')) {
      return 'Merging Two Sorted Linked Lists';
    }
  } else if (topic === 'Stacks and Queues') {
    if (sub.includes('parenthes') || sub.includes('bracket') || sub.includes('lifo')) {
      return 'Valid Parentheses Matching';
    }
    if (sub.includes('min stack')) {
      return 'Min Stack in O(1) Auxiliary Space';
    }
    if (sub.includes('monotonic')) {
      return 'Monotonic Increasing/Decreasing Stacks';
    }
    if (sub.includes('circular')) {
      return 'Circular Queue Ring Buffers';
    }
  } else if (topic === 'Recursion') {
    if (sub.includes('base case') || sub.includes('call stack')) {
      return 'Base Case Formulation & Call Stacks';
    }
    if (sub.includes('recurrence')) {
      return 'Recurrence Relations & Master Theorem';
    }
    if (sub.includes('backtracking')) {
      return 'Backtracking State Pruning';
    }
  } else if (topic === 'Trees') {
    if (sub.includes('bst') || sub.includes('inorder') || sub.includes('traversal')) {
      return 'DFS: Inorder, Preorder, Postorder';
    }
    if (sub.includes('level') || sub.includes('bfs')) {
      return 'BFS: Level-Order Traversal with Queue';
    }
    if (sub.includes('height') || sub.includes('depth')) {
      return 'Tree Height & Diameter Calculation';
    }
    if (sub.includes('lca')) {
      return 'Lowest Common Ancestor (LCA)';
    }
  }

  return subconcept.trim();
};
