import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, TOPICS, INITIAL_DKT_STATE, QUESTIONS_BANK, REVISION_ITEMS, ANALYTICS_DATA } from '../data/mockData';

const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState('landing'); // Screen 1-13 key
  const [screenParams, setScreenParams] = useState({});
  const [theme, setTheme] = useState('dark');

  // Core App Data States
  const [user, setUser] = useState(INITIAL_USER);
  const [topics, setTopics] = useState(TOPICS);
  const [dktState, setDktState] = useState(INITIAL_DKT_STATE);
  const [questionsBank, setQuestionsBank] = useState(QUESTIONS_BANK);
  const [revisionItems, setRevisionItems] = useState(REVISION_ITEMS);
  const [analytics, setAnalytics] = useState(ANALYTICS_DATA);

  // Active Quiz State
  const [activeQuestion, setActiveQuestion] = useState(QUESTIONS_BANK[0]);
  const [lastAttemptResult, setLastAttemptResult] = useState(null);

  // Sync Theme attribute on body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Screen Navigation Helper
  const navigateTo = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Deep Knowledge Tracing (DKT) Simulation Engine
  const processDKTAttempt = ({ questionId, topicId, isCorrect, timeTakenSec, attemptsCount, hintsUsedCount }) => {
    // 1. Calculate delta using sequence-aware DKT heuristic
    let baseDelta = isCorrect ? 0.09 : -0.06;
    
    // Time efficiency factor (optimal < 45 seconds)
    if (isCorrect && timeTakenSec < 35) {
      baseDelta += 0.04;
    } else if (isCorrect && timeTakenSec > 90) {
      baseDelta -= 0.02;
    }

    // Hint penalty
    if (hintsUsedCount > 0) {
      baseDelta -= 0.03 * hintsUsedCount;
    }

    // Attempt penalty
    if (attemptsCount > 1) {
      baseDelta -= 0.02 * (attemptsCount - 1);
    }

    // Ensure non-negative bounds
    setTopics(prevTopics =>
      prevTopics.map(t => {
        if (t.id === topicId) {
          const oldVal = t.mastery;
          const newVal = Math.min(99, Math.max(10, Math.round(oldVal + baseDelta * 100)));
          const newStatus = newVal >= 80 ? 'Strong' : newVal >= 50 ? 'Moderate' : 'Weak';
          return {
            ...t,
            mastery: newVal,
            status: newStatus,
            completedQuestions: t.completedQuestions + 1,
            forgettingRisk: newVal < 50 ? 'High (65%)' : newVal < 75 ? 'Medium (30%)' : 'Low (5%)'
          };
        }
        return t;
      })
    );

    // 2. Update DKT Hidden State Vector & Sequence Trajectory
    setDktState(prev => {
      const currentTopicVal = prev.topicMasteries[topicId] || 0.5;
      const updatedTopicVal = Math.min(0.99, Math.max(0.1, currentTopicVal + baseDelta));
      const newSeqLen = prev.sequenceLength + 1;
      
      const newVector = prev.hiddenStateVector.map((val, idx) => {
        // Shift hidden values to simulate LSTM state update
        const randVariation = (Math.random() - 0.5) * 0.05;
        return Number((Math.min(0.99, Math.max(0.05, val + (isCorrect ? 0.03 : -0.03) + randVariation))).toFixed(2));
      });

      return {
        ...prev,
        sequenceLength: newSeqLen,
        hiddenStateVector: newVector,
        lastUpdated: "Just now",
        topicMasteries: {
          ...prev.topicMasteries,
          [topicId]: updatedTopicVal
        }
      };
    });

    // 3. Store attempt result for Result Page & Analytics
    const attemptSummary = {
      questionId,
      topicId,
      isCorrect,
      timeTakenSec,
      attemptsCount,
      hintsUsedCount,
      masteryChange: Math.round(baseDelta * 100),
      timestamp: new Date().toLocaleTimeString()
    };

    setLastAttemptResult(attemptSummary);

    // 4. Update Analytics Timeline
    setAnalytics(prev => ({
      ...prev,
      hiddenStateTimeline: [
        ...prev.hiddenStateTimeline,
        {
          attempt: `Q${prev.hiddenStateTimeline.length + 1} (${topicId})`,
          hiddenVal: Number((0.5 + baseDelta).toFixed(2)),
          predictedMastery: Math.round(60 + baseDelta * 100)
        }
      ]
    }));

    // Update total solved count
    setUser(prev => ({
      ...prev,
      totalQuestionsSolved: prev.totalQuestionsSolved + 1,
      overallMastery: Math.min(99, Math.max(20, prev.overallMastery + (isCorrect ? 1 : -1)))
    }));

    return attemptSummary;
  };

  const startTopicQuestion = (topicId) => {
    const q = questionsBank.find(item => item.topicId === topicId) || questionsBank[0];
    setActiveQuestion(q);
    navigateTo('question', { questionId: q.id });
  };

  return (
    <LearningContext.Provider
      value={{
        currentScreen,
        screenParams,
        navigateTo,
        theme,
        toggleTheme,
        user,
        setUser,
        topics,
        dktState,
        questionsBank,
        revisionItems,
        analytics,
        activeQuestion,
        setActiveQuestion,
        lastAttemptResult,
        processDKTAttempt,
        startTopicQuestion
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => useContext(LearningContext);
