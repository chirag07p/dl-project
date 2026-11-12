import React, { useState, useEffect, useCallback } from 'react';
import type {
  DSATopicCategory,
  LearningSetupPreferences,
  TopicProgressSummary,
  DemoUserSession,
  ActivityRecord,
} from '../types';
import {
  DEFAULT_LEARNING_PREFERENCES,
  DEFAULT_TOPIC_PROGRESS,
  getCanonicalConcept,
} from '../data/dsaTopics';
import { getQuestionById } from '../data/dsaQuestions';
import {
  DemoLearningContext,
  PREFERENCES_STORAGE_KEY,
  STUDENT_STORAGE_KEY,
  ACTIVITY_STORAGE_KEY,
  TOPIC_PROGRESS_STORAGE_KEY,
} from './demoLearningTypes';
import { apiClient, type StudentFullPipelineResponse, type AskAiResponse } from '../services/api';

const DEFAULT_DEMO_STUDENT: DemoUserSession = {
  fullName: 'Alex Chen (Demo Student)',
  email: 'alex.chen@university.edu',
  academicLevel: '2nd Year - Intermediate (Data Structures Core)',
  isDemoSession: true,
  simulatedAt: 'Initialized for Milestone B',
};

export const DemoLearningProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load preferences from localStorage or use defaults
  const [preferences, setPreferences] = useState<LearningSetupPreferences>(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_LEARNING_PREFERENCES;
  });

  // Load student profile
  const [studentProfile, setStudentProfileState] = useState<DemoUserSession>(() => {
    try {
      const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_DEMO_STUDENT;
  });

  const [activeTopic, setActiveTopicState] = useState<DSATopicCategory>(
    preferences.initialTopic || 'Arrays and Strings'
  );

  const [topicProgress, setTopicProgress] = useState<TopicProgressSummary[]>(() => {
    try {
      const stored = localStorage.getItem(TOPIC_PROGRESS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_TOPIC_PROGRESS;
  });

  // Activity records state
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(() => {
    try {
      const stored = localStorage.getItem(ACTIVITY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const latestActivityRecord = activityRecords.length > 0 ? activityRecords[activityRecords.length - 1] : null;

  // Real Backend DKT Engine State
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [livePipelineData, setLivePipelineData] = useState<StudentFullPipelineResponse | null>(null);

  // Check backend health & fetch student profile
  const refreshBackendProfile = useCallback(async () => {
    try {
      const health = await apiClient.checkHealth();
      if (health && health.status === 'online') {
        setIsBackendConnected(true);
        const pipeline = await apiClient.getStudentProfile(studentProfile.fullName || 'demo_student');
        if (pipeline) {
          setLivePipelineData(pipeline);
        }
      } else {
        setIsBackendConnected(false);
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, [studentProfile.fullName]);

  useEffect(() => {
    refreshBackendProfile();
    // Poll backend health every 15 seconds
    const interval = setInterval(refreshBackendProfile, 15000);
    return () => clearInterval(interval);
  }, [refreshBackendProfile]);

  const askBackendTutor = useCallback(
    async (
      query: string,
      context?: { topic?: string; questionTitle?: string; codeSnippet?: string; isCorrect?: boolean }
    ): Promise<AskAiResponse | null> => {
      return await apiClient.askAiTutor({
        student_id: studentProfile.fullName || 'demo_student',
        query,
        topic: context?.topic || activeTopic,
        question_title: context?.questionTitle,
        code_snippet: context?.codeSnippet,
        is_correct: context?.isCorrect,
      });
    },
    [studentProfile.fullName, activeTopic]
  );

  // Sync preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore storage errors
    }
  }, [preferences]);

  // Sync student session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(studentProfile));
    } catch {
      // Ignore storage errors
    }
  }, [studentProfile]);

  // Sync activity records to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, JSON.stringify(activityRecords));
    } catch {
      // Ignore storage errors
    }
  }, [activityRecords]);

  // Sync topic progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TOPIC_PROGRESS_STORAGE_KEY, JSON.stringify(topicProgress));
    } catch {
      // Ignore storage errors
    }
  }, [topicProgress]);

  const updatePreferences = (newPrefs: Partial<LearningSetupPreferences>) => {
    setPreferences((prev) => {
      const updated: LearningSetupPreferences = {
        ...prev,
        ...newPrefs,
        lastUpdated: new Date().toLocaleDateString(),
      };
      if (newPrefs.initialTopic) {
        setActiveTopicState(newPrefs.initialTopic);
      }
      return updated;
    });

    // Update topicProgress 'In Progress' marker when initialTopic changes
    if (newPrefs.initialTopic) {
      setTopicProgress((prev) =>
        prev.map((t) => ({
          ...t,
          status: t.topic === newPrefs.initialTopic ? 'In Progress' : t.status === 'In Progress' ? 'Up Next' : t.status,
        }))
      );
    }
  };

  const setActiveTopic = (topic: DSATopicCategory) => {
    setActiveTopicState(topic);
    setPreferences((prev) => ({
      ...prev,
      initialTopic: topic,
      lastUpdated: new Date().toLocaleDateString(),
    }));
    setTopicProgress((prev) =>
      prev.map((t) => ({
        ...t,
        status: t.topic === topic ? 'In Progress' : t.status === 'In Progress' ? 'Up Next' : t.status,
      }))
    );
  };

  const setStudentProfile = (profile: DemoUserSession) => {
    setStudentProfileState(profile);
  };

  const getQuestionAttempts = (questionId: string): ActivityRecord[] => {
    return activityRecords.filter((r) => r.questionId.toLowerCase() === questionId.toLowerCase());
  };

  const recordSubmission = (
    submission: Omit<ActivityRecord, 'id' | 'timestamp' | 'attemptNumber'>
  ): ActivityRecord => {
    // Provider safeguard against duplicate submissions within 1s
    const latest = activityRecords[activityRecords.length - 1];
    if (
      latest &&
      latest.questionId === submission.questionId &&
      latest.submittedOptionId === submission.submittedOptionId &&
      Date.now() - new Date(latest.timestamp).getTime() < 1000
    ) {
      return latest;
    }

    const priorAttempts = getQuestionAttempts(submission.questionId);
    const attemptNumber = priorAttempts.length + 1;
    const newRecord: ActivityRecord = {
      ...submission,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      attemptNumber,
      timestamp: new Date().toISOString(),
    };

    setActivityRecords((prev) => [...prev, newRecord]);

    // Correct progress tracking (Requirement 2):
    // completedConcepts counts UNIQUE CONCEPTS mastered in the topic, not merely unique questions.
    if (newRecord.isCorrect) {
      const q = getQuestionById(newRecord.questionId);
      const rawConcept = q?.subconcept || newRecord.questionTitle;
      const canonicalConcept = getCanonicalConcept(rawConcept, newRecord.topic);

      setTopicProgress((prev) =>
        prev.map((t) => {
          if (t.topic === newRecord.topic) {
            const currentSample = Array.isArray(t.sampleConcepts) ? t.sampleConcepts : [];
            const alreadyMastered = currentSample.some(
              (c) => c.toLowerCase() === canonicalConcept.toLowerCase()
            );

            if (!alreadyMastered) {
              const updatedConcepts = [...currentSample, canonicalConcept];
              return {
                ...t,
                sampleConcepts: updatedConcepts,
                completedConcepts: Math.min(t.totalConcepts, updatedConcepts.length),
              };
            }
          }
          return t;
        })
      );
    }

    // Asynchronously dispatch to Python DKT LSTM Backend
    apiClient
      .submitInteraction({
        student_id: studentProfile.fullName || 'demo_student',
        question_id: newRecord.questionId,
        topic: newRecord.topic,
        is_correct: newRecord.isCorrect,
        time_taken_seconds: newRecord.timeTakenSeconds,
        attempts: newRecord.attemptNumber,
        days_advanced: 0.1,
      })
      .then((res) => {
        if (res && res.success) {
          setIsBackendConnected(true);
          setLivePipelineData({
            student_id: studentProfile.fullName || 'demo_student',
            student_name: studentProfile.fullName || 'demo_student',
            current_day: res.profile.current_day,
            profile: res.profile,
            weaknesses: res.weaknesses,
            forgetting_alerts: res.forgetting_alerts,
            learning_style: res.learning_style,
            recommendation: res.recommendation,
          });
        }
      })
      .catch(() => {
        // Non-blocking fallback to local state
      });

    return newRecord;
  };

  const resetDemoData = () => {
    setPreferences(DEFAULT_LEARNING_PREFERENCES);
    setStudentProfileState(DEFAULT_DEMO_STUDENT);
    setActiveTopicState(DEFAULT_LEARNING_PREFERENCES.initialTopic);
    setTopicProgress(DEFAULT_TOPIC_PROGRESS);
    setActivityRecords([]);
    setLivePipelineData(null);
    apiClient.resetDemo().catch(() => {});
    try {
      localStorage.removeItem(PREFERENCES_STORAGE_KEY);
      localStorage.removeItem(STUDENT_STORAGE_KEY);
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      localStorage.removeItem(TOPIC_PROGRESS_STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <DemoLearningContext.Provider
      value={{
        preferences,
        activeTopic,
        topicProgress,
        studentProfile,
        activityRecords,
        latestActivityRecord,
        updatePreferences,
        setActiveTopic,
        setStudentProfile,
        recordSubmission,
        getQuestionAttempts,
        resetDemoData,
        isBackendConnected,
        livePipelineData,
        refreshBackendProfile,
        askBackendTutor,
      }}
    >
      {children}
    </DemoLearningContext.Provider>
  );
};
