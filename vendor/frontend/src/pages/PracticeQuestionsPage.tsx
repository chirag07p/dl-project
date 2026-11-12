import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { DSATopicCategory, DifficultyLevel, DSAQuestion, ActivityRecord } from '../types';
import { DSA_TOPICS } from '../data/dsaTopics';
import { getQuestionsByTopic } from '../data/dsaQuestions';
import { useDemoLearning } from '../context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BrainIcon,
  ClockIcon,
  ArrowRightIcon,
  SparklesIcon,
  LayersIcon,
  ShieldCheckIcon,
} from '../components/icons';
import { AiTutorDrawer } from '../components/ai/AiTutorDrawer';

const ALL_CATEGORIES: DSATopicCategory[] = [
  'Arrays and Strings',
  'Searching',
  'Sorting',
  'Linked Lists',
  'Stacks and Queues',
  'Recursion',
  'Trees',
];

interface ActiveQuestionWorkspaceProps {
  currentQuestion: DSAQuestion;
  selectedQuestionIndex: number;
  totalQuestions: number;
  availableQuestions: DSAQuestion[];
  currentTopic: DSATopicCategory;
  difficultyFilter: DifficultyLevel | 'All';
  priorAttempts: ActivityRecord[];
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onSelectQuestionId: (qid: string) => void;
  onDifficultyChange: (diff: DifficultyLevel | 'All') => void;
  recordSubmission: (submission: Omit<ActivityRecord, 'id' | 'timestamp' | 'attemptNumber'>) => ActivityRecord;
  getQuestionAttempts: (questionId: string) => ActivityRecord[];
  learningGoal: string;
  preferredDifficulty: DifficultyLevel;
  dailyTargetQuestions: number;
}

/**
 * Keyed active question session component.
 * Keying by currentQuestion.id automatically resets timer, answer choices, and validation errors
 * on question navigation without calling setState during render.
 */
const ActiveQuestionWorkspace: React.FC<ActiveQuestionWorkspaceProps> = ({
  currentQuestion,
  selectedQuestionIndex,
  totalQuestions,
  availableQuestions,
  currentTopic,
  difficultyFilter,
  priorAttempts,
  onPrevQuestion,
  onNextQuestion,
  onSelectQuestionId,
  onDifficultyChange,
  recordSubmission,
  getQuestionAttempts,
  learningGoal,
  preferredDifficulty,
  dailyTargetQuestions,
}) => {
  const navigate = useNavigate();
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Synchronous submission lock (Requirement 1)
  const isSubmittingRef = useRef(false);

  // Stopwatch timer interval - starts fresh on mount, stops on submission or unmount
  useEffect(() => {
    if (!isTimerActive) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive]);

  const formatTimer = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId: string) => {
    if (isSubmittingRef.current || isSubmitting) return;
    setSelectedOptionId(optionId);
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Priority 1: Synchronous submission lock prevents rapid repeated clicks from creating duplicate activity records
    if (isSubmittingRef.current) return;

    if (!selectedOptionId) {
      setValidationError('Please select an answer choice before submitting.');
      return;
    }

    // Acquire lock synchronously before any async operations or re-renders
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setIsTimerActive(false);

    try {
      const timeTaken = Math.max(1, elapsedSeconds);
      const selectedOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
      const isCorrect = selectedOptionId === currentQuestion.correctOptionId;

      const record = recordSubmission({
        questionId: currentQuestion.id,
        questionTitle: currentQuestion.title,
        topic: currentQuestion.topic,
        difficulty: currentQuestion.difficulty,
        submittedOptionId: selectedOptionId,
        submittedOptionText: selectedOption?.text || '',
        correctOptionId: currentQuestion.correctOptionId,
        isCorrect,
        timeTakenSeconds: timeTaken,
        explanation: currentQuestion.explanation,
      });

      const hasNext = selectedQuestionIndex < totalQuestions - 1;
      const nextQ = hasNext ? availableQuestions[selectedQuestionIndex + 1] : null;

      navigate('/result', {
        state: {
          record,
          question: currentQuestion,
          nextQuestionId: nextQ ? nextQ.id : null,
          isLastQuestion: !hasNext,
          topic: currentTopic,
          difficultyFilter,
          questionIndex: selectedQuestionIndex,
          totalQuestions,
        },
      });
    } catch (err) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      throw err;
    }
  };

  return (
    <>
      {/* 3. Filters & Question Meta Row */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Difficulty Filter:</span>
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => onDifficultyChange(diff)}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                difficultyFilter === diff
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Stopwatch Timer & Question Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs font-semibold text-slate-800 shadow-2xs dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <ClockIcon size={14} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span>{formatTimer(elapsedSeconds)}</span>
            <span className="text-2xs text-slate-400">/ {currentQuestion.timeTargetSeconds}s target</span>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Question <span className="font-bold text-slate-900 dark:text-white">{selectedQuestionIndex + 1}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-white">{totalQuestions}</span>
          </div>
        </div>
      </div>

      {/* 4. Question Display */}
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Question Column */}
        <div className="lg:col-span-8">
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
            {/* Question Header */}
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default" size="sm">
                    {currentQuestion.id}
                  </Badge>
                  <Badge
                    variant={
                      currentQuestion.difficulty === 'Easy'
                        ? 'success'
                        : currentQuestion.difficulty === 'Medium'
                        ? 'warning'
                        : 'danger'
                    }
                    size="sm"
                  >
                    {currentQuestion.difficulty}
                  </Badge>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {currentQuestion.subconcept}
                  </span>
                </div>

                {priorAttempts.length > 0 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Attempted {priorAttempts.length} time{priorAttempts.length > 1 ? 's' : ''} previously
                  </span>
                )}
              </div>

              <CardTitle className="mt-3 text-xl font-bold text-slate-900 dark:text-white">
                {currentQuestion.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
                {currentQuestion.prompt}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Code Snippet Box (if available) */}
              {currentQuestion.codeSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-2xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span>Algorithm Implementation ({currentQuestion.codeLanguage || 'typescript'})</span>
                    <span>Read-only snippet</span>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-400 shadow-inner">
                    <pre>
                      <code>{currentQuestion.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Answer Options Radio Group */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Your Answer Choice:
                </label>

                <div className="space-y-3" role="radiogroup" aria-label="Question answer options">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <div
                        key={option.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => handleSelectOption(option.id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleSelectOption(option.id);
                          }
                        }}
                        className={`flex cursor-pointer items-start gap-3.5 rounded-xl border p-4 transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/30 dark:border-indigo-500 dark:bg-indigo-950/40'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700'
                        }`}
                      >
                        {/* Radio badge */}
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                              : 'border border-slate-300 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {option.id}
                        </div>

                        <div className="flex-1 text-sm font-medium leading-relaxed text-slate-900 dark:text-slate-100">
                          {option.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Validation Error Banner */}
                {validationError && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
                    <span>⚠️ {validationError}</span>
                  </div>
                )}
              </div>
            </CardContent>

            {/* Card Footer with Working Actions */}
            <CardFooter className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 sm:flex-row dark:border-slate-800 dark:bg-slate-900/40">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevQuestion}
                  disabled={selectedQuestionIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextQuestion}
                  disabled={selectedQuestionIndex === totalQuestions - 1}
                >
                  Next
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAiOpen(true)}
                  leftIcon={<SparklesIcon size={14} />}
                  className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
                >
                  Ask AI Tutor
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedOptionId('');
                    setValidationError(null);
                  }}
                  disabled={!selectedOptionId || isSubmitting}
                >
                  Clear Choice
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => handleSubmit()}
                  disabled={isSubmitting}
                  rightIcon={<ArrowRightIcon size={16} />}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right Sidebar: Quick Navigation & Learning Context */}
        <div className="space-y-6 lg:col-span-4">
          {/* Question Jump Palette */}
          <Card>
            <CardHeader className="mb-3">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Topic Question Roster
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                {currentTopic} ({totalQuestions} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {availableQuestions.map((q, idx) => {
                  const isCurrent = idx === selectedQuestionIndex;
                  const attempts = getQuestionAttempts(q.id);
                  const hasPassed = attempts.some((a) => a.isCorrect);

                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => onSelectQuestionId(q.id)}
                      className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-semibold transition-all ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300'
                          : hasPassed
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      <span className="text-3xs font-normal text-slate-400">{q.difficulty}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Target Card */}
          <Card className="border-indigo-100 bg-indigo-50/40 dark:border-indigo-950/80 dark:bg-indigo-950/20">
            <CardHeader className="mb-2">
              <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <SparklesIcon size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Active Goal</span>
              </div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                {learningGoal}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p>
                Calibrated starting difficulty: <strong>{preferredDifficulty}</strong>
              </p>
              <p>
                Target questions/day: <strong>{dailyTargetQuestions}</strong>
              </p>
              <div className="pt-2">
                <Link to="/setup" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                  Reconfigure Setup Preferences →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Verification & Integrity Rule Notice */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
              <ShieldCheckIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Standardized Evaluation</span>
            </div>
            <p className="mt-1 leading-relaxed">
              All questions use centralized correctness rules and standard IDs to guarantee consistent telemetry contracts for future backend and ML integration.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive AI Tutor Drawer */}
      <AiTutorDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        contextQuestion={{
          title: currentQuestion.title,
          topic: currentTopic,
          codeSnippet: currentQuestion.codeSnippet,
        }}
      />
    </>
  );
};

export const PracticeQuestionsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeTopic, setActiveTopic, preferences, recordSubmission, getQuestionAttempts } = useDemoLearning();

  // Derive active topic from URL or centralized context
  const topicParam = searchParams.get('topic');
  const currentTopic: DSATopicCategory = useMemo(() => {
    if (topicParam) {
      const matched = DSA_TOPICS.find(
        (t) => t.name.toLowerCase() === topicParam.toLowerCase() || t.slug === topicParam.toLowerCase()
      );
      if (matched) return matched.name;
    }
    return activeTopic || 'Arrays and Strings';
  }, [topicParam, activeTopic]);

  // Synchronize difficulty filter with URL (?difficulty=...)
  const diffParam = searchParams.get('difficulty');
  const difficultyFilter: DifficultyLevel | 'All' = useMemo(() => {
    if (diffParam && (['Easy', 'Medium', 'Hard'] as const).includes(diffParam as DifficultyLevel)) {
      return diffParam as DifficultyLevel;
    }
    return 'All';
  }, [diffParam]);

  // Filter questions for current topic & difficulty filter
  const availableQuestions = useMemo(() => {
    const topicQs = getQuestionsByTopic(currentTopic);
    if (difficultyFilter === 'All') {
      return topicQs;
    }
    return topicQs.filter((q) => q.difficulty === difficultyFilter);
  }, [currentTopic, difficultyFilter]);

  // Handle specific question ID from URL (?qid=...)
  // Requirement 3: Handle invalid qid values safely instead of silently selecting Question 1
  const qidParam = searchParams.get('qid');
  const qidMatchIndex = useMemo(() => {
    if (!qidParam) return -1;
    return availableQuestions.findIndex((q) => q.id.toLowerCase() === qidParam.toLowerCase());
  }, [qidParam, availableQuestions]);

  const isInvalidQid = Boolean(qidParam && qidMatchIndex === -1);
  const selectedQuestionIndex = qidMatchIndex !== -1 ? qidMatchIndex : 0;
  const currentQuestion = isInvalidQid ? null : (availableQuestions[selectedQuestionIndex] ?? null);

  // Attempt history for current question
  const priorAttempts = useMemo(() => {
    if (!currentQuestion) return [];
    return getQuestionAttempts(currentQuestion.id);
  }, [currentQuestion, getQuestionAttempts]);

  const handleTopicChange = (newTopic: DSATopicCategory) => {
    setActiveTopic(newTopic);
    const nextParams: Record<string, string> = { topic: newTopic };
    if (difficultyFilter !== 'All') {
      nextParams.difficulty = difficultyFilter;
    }
    setSearchParams(nextParams);
  };

  const handleDifficultyChange = (newDiff: DifficultyLevel | 'All') => {
    const nextParams: Record<string, string> = { topic: currentTopic };
    if (newDiff !== 'All') {
      nextParams.difficulty = newDiff;
    }
    setSearchParams(nextParams);
  };

  const handleSelectQuestionId = (qid: string) => {
    const nextParams: Record<string, string> = {
      topic: currentTopic,
      qid,
    };
    if (difficultyFilter !== 'All') {
      nextParams.difficulty = difficultyFilter;
    }
    setSearchParams(nextParams);
  };

  const handlePrevQuestion = () => {
    if (selectedQuestionIndex > 0) {
      const prevQ = availableQuestions[selectedQuestionIndex - 1];
      handleSelectQuestionId(prevQ.id);
    }
  };

  const handleNextQuestion = () => {
    if (selectedQuestionIndex < availableQuestions.length - 1) {
      const nextQ = availableQuestions[selectedQuestionIndex + 1];
      handleSelectQuestionId(nextQ.id);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header & Breadcrumbs */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              Dashboard
            </Link>
            <span>/</span>
            <Link to="/topics" className="hover:text-indigo-600 dark:hover:text-indigo-400">
              DSA Topics
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold dark:text-white">Practice Questions</span>
          </div>

          <div className="mt-2 flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:white">
              Adaptive Practice Questions
            </h1>
            <Badge variant="default" size="md">
              Screen 7 Active
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Algorithmic challenges calibrated to your learning goals. Timed and recorded for adaptive revision.
          </p>
        </div>

        {/* Prototype demo notice */}
        <div className="flex items-center gap-2 self-start rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <BrainIcon size={16} className="shrink-0" />
          <span>Demo Question Bank • Live Timer Active</span>
        </div>
      </div>

      {/* 2. Topic Category Selector Pills */}
      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Curriculum Category
        </label>
        <div className="mt-2 flex flex-wrap gap-2">
          {ALL_CATEGORIES.map((topicName) => {
            const isSelected = currentTopic === topicName;
            return (
              <button
                key={topicName}
                type="button"
                onClick={() => handleTopicChange(topicName)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs dark:bg-indigo-500'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {topicName}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Question Display or Safe Invalid/Empty States */}
      {isInvalidQid ? (
        <>
          {/* Difficulty Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Difficulty Filter:</span>
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => handleDifficultyChange(diff)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <Card className="mt-6 border-amber-200 p-12 text-center dark:border-amber-900/60">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <LayersIcon size={28} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Question Not Found
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              The requested question ID <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">{qidParam}</code> was not found in <strong>"{currentTopic}"</strong>{difficultyFilter !== 'All' ? ` with difficulty "${difficultyFilter}"` : ''}.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {availableQuestions.length > 0 && (
                <Button
                  variant="primary"
                  onClick={() => handleSelectQuestionId(availableQuestions[0].id)}
                >
                  Go to First Question ({availableQuestions[0].id})
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/topics')}>
                Browse All Topics
              </Button>
              {difficultyFilter !== 'All' && (
                <Button variant="outline" onClick={() => handleDifficultyChange('All')}>
                  Clear Difficulty Filter
                </Button>
              )}
            </div>
          </Card>
        </>
      ) : !currentQuestion ? (
        <>
          {/* Difficulty Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Difficulty Filter:</span>
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => handleDifficultyChange(diff)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <Card className="mt-6 p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <LayersIcon size={28} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No Questions Available for Current Filter
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
              There are no questions matching {difficultyFilter !== 'All' ? `difficulty "${difficultyFilter}" in ` : ''}
              <strong>"{currentTopic}"</strong> in this demo snapshot.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="primary" onClick={() => handleTopicChange('Arrays and Strings')}>
                Switch to Arrays and Strings
              </Button>
              {difficultyFilter !== 'All' && (
                <Button variant="outline" onClick={() => handleDifficultyChange('All')}>
                  Clear Difficulty Filter
                </Button>
              )}
            </div>
          </Card>
        </>
      ) : (
        /* Requirement 4: Keyed ActiveQuestionWorkspace guarantees state resets on question change without render-time setState */
        <ActiveQuestionWorkspace
          key={currentQuestion.id}
          currentQuestion={currentQuestion}
          selectedQuestionIndex={selectedQuestionIndex}
          totalQuestions={availableQuestions.length}
          availableQuestions={availableQuestions}
          currentTopic={currentTopic}
          difficultyFilter={difficultyFilter}
          priorAttempts={priorAttempts}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          onSelectQuestionId={handleSelectQuestionId}
          onDifficultyChange={handleDifficultyChange}
          recordSubmission={recordSubmission}
          getQuestionAttempts={getQuestionAttempts}
          learningGoal={preferences.learningGoal}
          preferredDifficulty={preferences.preferredDifficulty}
          dailyTargetQuestions={preferences.dailyTargetQuestions}
        />
      )}
    </div>
  );
};
