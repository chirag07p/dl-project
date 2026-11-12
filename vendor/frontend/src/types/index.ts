/**
 * Core domain types for Personalized Learning AI application.
 */

export type DSATopicCategory =
  | 'Arrays and Strings'
  | 'Searching'
  | 'Sorting'
  | 'Linked Lists'
  | 'Stacks and Queues'
  | 'Recursion'
  | 'Trees';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface DSATopicInfo {
  id: string;
  name: DSATopicCategory;
  slug: string;
  description: string;
  estimatedConcepts: number;
}

export type ScreenId =
  | 'landing'
  | 'login'
  | 'register'
  | 'learning-setup'
  | 'dashboard'
  | 'dsa-topics'
  | 'practice-questions'
  | 'answer-result'
  | 'knowledge-profile'
  | 'recommendations-revision'
  | 'profile-settings';

export interface ScreenDefinition {
  id: ScreenId;
  name: string;
  route: string;
  stepNumber: number;
  description: string;
  plannedMilestone: 'A' | 'B' | 'C';
  status: 'active' | 'scaffolded' | 'planned';
}

export interface WorkflowStage {
  step: number;
  title: string;
  description: string;
}

export type Theme = 'light' | 'dark';

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;

export interface RegisterFormValues {
  fullName: string;
  email: string;
  academicLevel: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

export interface DemoUserSession {
  fullName: string;
  email: string;
  academicLevel?: string;
  isDemoSession: true;
  simulatedAt: string;
}

export type LearningGoal =
  | 'College Coursework & Exams'
  | 'Interview Preparation'
  | 'Foundations & Problem Solving'
  | 'Rapid Revision & Spaced Practice';

export interface LearningSetupPreferences {
  initialTopic: DSATopicCategory;
  learningGoal: LearningGoal;
  preferredDifficulty: DifficultyLevel;
  dailyTargetQuestions: number;
  lastUpdated: string;
}

export interface TopicProgressSummary {
  topic: DSATopicCategory;
  slug: string;
  status: 'In Progress' | 'Up Next' | 'Queued';
  completedConcepts: number;
  totalConcepts: number;
  sampleConcepts: string[];
}

export type QuestionType = 'multiple_choice' | 'code_analysis';

export interface QuestionOption {
  id: string; // 'A', 'B', 'C', 'D'
  text: string;
  explanationSnippet?: string;
}

export interface DSAQuestion {
  id: string; // e.g. 'AS-01'
  topic: DSATopicCategory;
  topicSlug: string;
  subconcept: string; // e.g. 'Two-Pointer Technique'
  difficulty: DifficultyLevel;
  type: QuestionType;
  title: string;
  prompt: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: QuestionOption[];
  correctOptionId: string; // 'A', 'B', 'C', or 'D'
  explanation: string;
  keyTakeaway: string;
  timeTargetSeconds: number;
}

export interface ActivityRecord {
  id: string;
  questionId: string;
  questionTitle: string;
  topic: DSATopicCategory;
  difficulty: DifficultyLevel;
  submittedOptionId: string;
  submittedOptionText: string;
  correctOptionId: string;
  isCorrect: boolean;
  timeTakenSeconds: number;
  attemptNumber: number;
  timestamp: string; // ISO string
  explanation: string;
}


