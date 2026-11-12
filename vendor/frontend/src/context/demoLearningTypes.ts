import { createContext } from 'react';
import type {
  DSATopicCategory,
  LearningSetupPreferences,
  TopicProgressSummary,
  DemoUserSession,
  ActivityRecord,
} from '../types';
import type { StudentFullPipelineResponse, AskAiResponse } from '../services/api';

export interface DemoLearningContextType {
  preferences: LearningSetupPreferences;
  activeTopic: DSATopicCategory;
  topicProgress: TopicProgressSummary[];
  studentProfile: DemoUserSession;
  activityRecords: ActivityRecord[];
  latestActivityRecord: ActivityRecord | null;
  updatePreferences: (newPrefs: Partial<LearningSetupPreferences>) => void;
  setActiveTopic: (topic: DSATopicCategory) => void;
  setStudentProfile: (profile: DemoUserSession) => void;
  recordSubmission: (submission: Omit<ActivityRecord, 'id' | 'timestamp' | 'attemptNumber'>) => ActivityRecord;
  getQuestionAttempts: (questionId: string) => ActivityRecord[];
  resetDemoData: () => void;
  // Backend Integration
  isBackendConnected: boolean;
  livePipelineData: StudentFullPipelineResponse | null;
  refreshBackendProfile: () => Promise<void>;
  askBackendTutor: (
    query: string,
    context?: { topic?: string; questionTitle?: string; codeSnippet?: string; isCorrect?: boolean }
  ) => Promise<AskAiResponse | null>;
}

export const DemoLearningContext = createContext<DemoLearningContextType | undefined>(undefined);

export const PREFERENCES_STORAGE_KEY = 'pl_demo_learning_preferences';
export const STUDENT_STORAGE_KEY = 'pl_demo_student_session';
export const ACTIVITY_STORAGE_KEY = 'pl_demo_activity_records';
export const TOPIC_PROGRESS_STORAGE_KEY = 'pl_demo_topic_progress';

