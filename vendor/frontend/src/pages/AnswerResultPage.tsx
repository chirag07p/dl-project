import React, { useMemo, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import type { ActivityRecord, DSAQuestion, DSATopicCategory, DifficultyLevel } from '../types';
import { getQuestionById, getQuestionsByTopic } from '../data/dsaQuestions';
import { useDemoLearning } from '../context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BrainIcon,
  CheckCircleIcon,
  XIcon,
  ArrowRightIcon,
  RotateCcwIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  LayersIcon,
} from '../components/icons';
import { AiTutorDrawer } from '../components/ai/AiTutorDrawer';

interface LocationState {
  record?: ActivityRecord;
  question?: DSAQuestion;
  nextQuestionId?: string | null;
  isLastQuestion?: boolean;
  topic?: DSATopicCategory;
  difficultyFilter?: DifficultyLevel | 'All';
  questionIndex?: number;
  totalQuestions?: number;
}

export const AnswerResultPage: React.FC = () => {
  const location = useLocation();
  const { activeTopic, isBackendConnected, livePipelineData } = useDemoLearning();
  const [isAiOpen, setIsAiOpen] = useState(false);

  const state = (location.state as LocationState) || {};
  // Priority 4: Avoid showing an unrelated old result when /result is opened without valid result state
  const record: ActivityRecord | null = state.record || null;

  // Resolve matching question
  const question: DSAQuestion | undefined =
    state.question || (record ? getQuestionById(record.questionId) : undefined);

  // Priority 1 & 4: Resolve next question in the topic / difficulty roster
  const topicQuestions = useMemo(() => {
    if (!record) return [];
    const list = getQuestionsByTopic(record.topic);
    if (state.difficultyFilter && state.difficultyFilter !== 'All') {
      return list.filter((q) => q.difficulty === state.difficultyFilter);
    }
    return list;
  }, [record, state.difficultyFilter]);

  const nextQuestion = useMemo<DSAQuestion | null>(() => {
    if (!record) return null;
    if (state.nextQuestionId) {
      return getQuestionById(state.nextQuestionId) || null;
    }
    if (state.isLastQuestion) {
      return null;
    }
    const idx = topicQuestions.findIndex(
      (q) => q.id.toLowerCase() === record.questionId.toLowerCase()
    );
    if (idx !== -1 && idx < topicQuestions.length - 1) {
      return topicQuestions[idx + 1];
    }
    return null;
  }, [record, state.nextQuestionId, state.isLastQuestion, topicQuestions]);

  // Fallback state if accessed directly without any previous attempt
  if (!record || !question) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <Card className="p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <LayersIcon size={28} />
          </div>
          <h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
            No Recent Practice Submission Found
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
            Please complete a question on the Practice screen to view instant evaluation, test case explanations, and activity records.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to={`/practice?topic=${encodeURIComponent(activeTopic)}`}>
              <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />}>
                Go to Practice Questions
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isCorrect = record.isCorrect;
  const correctOption = question.options.find((o) => o.id === question.correctOptionId);

  const isLastQuestion = state.isLastQuestion ?? (nextQuestion === null);
  const firstQuestionInTopic = topicQuestions[0] ?? null;

  const diffParam =
    state.difficultyFilter && state.difficultyFilter !== 'All'
      ? `&difficulty=${encodeURIComponent(state.difficultyFilter)}`
      : '';

  const nextQuestionUrl = nextQuestion
    ? `/practice?topic=${encodeURIComponent(record.topic)}&qid=${encodeURIComponent(nextQuestion.id)}${diffParam}`
    : null;

  const retryQuestionUrl = `/practice?topic=${encodeURIComponent(record.topic)}&qid=${encodeURIComponent(record.questionId)}${diffParam}`;

  const restartTopicUrl = firstQuestionInTopic
    ? `/practice?topic=${encodeURIComponent(record.topic)}&qid=${encodeURIComponent(firstQuestionInTopic.id)}${diffParam}`
    : `/practice?topic=${encodeURIComponent(record.topic)}`;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        <Link to="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Dashboard
        </Link>
        <span>/</span>
        <Link to={`/practice?topic=${encodeURIComponent(record.topic)}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
          Practice ({record.topic})
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold dark:text-white">Answer Result</span>
      </div>

      {/* 2. Top Evaluation Banner */}
      <div
        className={`mt-6 overflow-hidden rounded-2xl border p-6 sm:p-8 ${
          isCorrect
            ? 'border-emerald-200 bg-emerald-50/80 dark:border-emerald-900/60 dark:bg-emerald-950/30'
            : 'border-amber-200 bg-amber-50/80 dark:border-amber-900/60 dark:bg-amber-950/30'
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isCorrect
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                  : 'bg-amber-600 text-white dark:bg-amber-500'
              }`}
            >
              {isCorrect ? <CheckCircleIcon size={28} /> : <XIcon size={28} />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Badge variant={isCorrect ? 'success' : 'warning'} size="sm">
                  {isCorrect ? 'Correct Answer' : 'Incorrect Solution'}
                </Badge>
                <Badge variant="outline" size="sm">
                  Attempt #{record.attemptNumber}
                </Badge>
                {isLastQuestion && (
                  <Badge variant="neutral" size="sm">
                    Final Question in Topic
                  </Badge>
                )}
                {isBackendConnected && livePipelineData ? (
                  <Badge variant="success" size="sm">
                    🧠 DKT Mastery: {(livePipelineData.profile.overall_mastery * 100).toFixed(0)}%
                  </Badge>
                ) : (
                  <Badge variant="default" size="sm">
                    Screen 8 Active
                  </Badge>
                )}
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {isCorrect ? 'Excellent! Correct Solution' : 'Solution Needs Revision'}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {isLastQuestion
                  ? `You have reached the final question for ${record.topic}${state.difficultyFilter && state.difficultyFilter !== 'All' ? ` (${state.difficultyFilter})` : ''}! Review your solution below, retry this problem, or continue to other topics.`
                  : isCorrect
                  ? 'Your selected option satisfies all algorithmic invariants and optimal time complexity bounds.'
                  : 'Your selected option misses a key boundary invariant. Review the detailed conceptual breakdown below.'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAiOpen(true)}
              leftIcon={<SparklesIcon size={16} />}
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/60 dark:text-indigo-300 dark:hover:bg-indigo-950/40"
            >
              Ask AI About Solution
            </Button>
            {nextQuestionUrl ? (
              <Link to={nextQuestionUrl}>
                <Button variant="primary" size="md" rightIcon={<ArrowRightIcon size={16} />}>
                  Next Practice Question
                </Button>
              </Link>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <Link to="/topics">
                  <Button variant="primary" size="md" rightIcon={<ArrowRightIcon size={16} />}>
                    Explore Next Topic
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="md">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Performance & Activity Metrics */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Question ID
          </div>
          <div className="mt-1 font-mono text-base font-bold text-slate-900 dark:text-white">
            {record.questionId}
          </div>
          <div className="text-2xs text-slate-400">{question.subconcept}</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Difficulty Level
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">{record.difficulty}</span>
            <Badge
              variant={
                record.difficulty === 'Easy'
                  ? 'success'
                  : record.difficulty === 'Medium'
                  ? 'warning'
                  : 'danger'
              }
              size="sm"
            >
              {record.difficulty}
            </Badge>
          </div>
          <div className="text-2xs text-slate-400">{record.topic}</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Time Taken
          </div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-base font-bold text-slate-900 dark:text-white">
            <ClockIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>{record.timeTakenSeconds}s</span>
          </div>
          <div className="text-2xs text-slate-400">Target: {question.timeTargetSeconds}s</div>
        </Card>

        <Card className="p-4">
          <div className="text-2xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Telemetry Recorded
          </div>
          <div className="mt-1 text-base font-bold text-emerald-600 dark:text-emerald-400">
            Logged
          </div>
          <div className="text-2xs text-slate-400">Activity State Synced</div>
        </Card>
      </div>

      {/* 4. Answer Choice Comparison */}
      <div className="mt-8 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Choice Comparison & Evaluation
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Student's Selected Answer */}
          <Card
            className={`border-2 ${
              isCorrect
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                : 'border-red-400 bg-red-50/30 dark:border-red-900/70 dark:bg-red-950/20'
            }`}
          >
            <CardHeader className="mb-2">
              <div className="flex items-center justify-between">
                <Badge variant={isCorrect ? 'success' : 'danger'} size="sm">
                  {isCorrect ? 'Your Answer (Correct)' : 'Your Answer (Incorrect)'}
                </Badge>
                <span className="font-mono text-xs font-bold text-slate-500">
                  Option {record.submittedOptionId}
                </span>
              </div>
              <CardTitle className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                {record.submittedOptionText}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Correct Answer */}
          <Card className="border-2 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20">
            <CardHeader className="mb-2">
              <div className="flex items-center justify-between">
                <Badge variant="success" size="sm">
                  Verified Correct Solution
                </Badge>
                <span className="font-mono text-xs font-bold text-slate-500">
                  Option {question.correctOptionId}
                </span>
              </div>
              <CardTitle className="mt-2 text-base font-semibold text-slate-900 dark:text-white">
                {correctOption?.text}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* 5. Detailed Step-by-Step Conceptual Explanation */}
      <div className="mt-8 space-y-6">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BrainIcon size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">Algorithmic Breakdown</span>
            </div>
            <CardTitle className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
              Step-by-Step Conceptual Explanation
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
              Rigorous invariant proof and complexity analysis for {question.title}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Primary Explanation Paragraph */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 leading-relaxed text-slate-700 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              <p className="text-sm font-medium">{question.explanation}</p>
            </div>

            {/* Code Snippet Reference (if available) */}
            {question.codeSnippet && (
              <div className="space-y-2">
                <span className="text-2xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Referenced Code Snippet:
                </span>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-400">
                  <pre>
                    <code>{question.codeSnippet}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Why other options fail breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Analysis of Each Option:
              </h3>
              <div className="space-y-2">
                {question.options.map((opt) => {
                  const isThisCorrect = opt.id === question.correctOptionId;
                  const isThisSelected = opt.id === record.submittedOptionId;

                  return (
                    <div
                      key={opt.id}
                      className={`rounded-xl border p-3.5 text-xs transition-colors ${
                        isThisCorrect
                          ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/60 dark:bg-emerald-950/30'
                          : isThisSelected
                          ? 'border-red-200 bg-red-50/60 dark:border-red-900/60 dark:bg-red-950/30'
                          : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-2xs ${
                            isThisCorrect
                              ? 'bg-emerald-600 text-white'
                              : isThisSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {opt.id}
                        </span>
                        <span>{opt.text}</span>
                        {isThisCorrect && (
                          <Badge variant="success" size="sm" className="ml-auto">
                            Correct
                          </Badge>
                        )}
                        {!isThisCorrect && isThisSelected && (
                          <Badge variant="danger" size="sm" className="ml-auto">
                            Your Choice
                          </Badge>
                        )}
                      </div>
                      {opt.explanationSnippet && (
                        <p className="mt-1.5 pl-7 text-slate-600 dark:text-slate-400">
                          {opt.explanationSnippet}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Algorithmic Takeaway Card */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs text-indigo-900 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-200">
              <div className="flex items-center gap-2 font-bold">
                <SparklesIcon size={16} />
                <span>Key Algorithmic Takeaway</span>
              </div>
              <p className="mt-1.5 leading-relaxed">{question.keyTakeaway}</p>
            </div>
          </CardContent>

          {/* Action buttons footer */}
          <CardFooter className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 pt-4 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <Link to={retryQuestionUrl}>
                <Button variant="outline" size="sm" leftIcon={<RotateCcwIcon size={14} />}>
                  Try Question Again
                </Button>
              </Link>
              <Link to="/topics">
                <Button variant="ghost" size="sm">
                  View All Topics
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="outline" size="md">
                  Return to Dashboard
                </Button>
              </Link>
              {nextQuestionUrl ? (
                <Link to={nextQuestionUrl}>
                  <Button variant="primary" size="md" rightIcon={<ArrowRightIcon size={16} />}>
                    Next Question
                  </Button>
                </Link>
              ) : (
                <Link to={restartTopicUrl}>
                  <Button variant="outline" size="md" leftIcon={<RotateCcwIcon size={14} />}>
                    Restart Topic from Q1
                  </Button>
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>

        {/* Telemetry and Future ML Contract Notice */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500 shadow-2xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheckIcon size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Telemetry Contract & Activity Record</span>
          </div>
          <p className="mt-1 leading-relaxed">
            Record created: <code>{record.id}</code> at <code>{new Date(record.timestamp).toLocaleTimeString()}</code>.
            This standardized record structure preserves question ID, topic categorization, difficulty calibration, latency in seconds, and correctness for downstream knowledge tracing.
          </p>
        </div>
      </div>

      {/* AI Tutor Drawer pre-loaded with current question & correctness */}
      <AiTutorDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        contextQuestion={{
          title: question.title,
          topic: record.topic,
          codeSnippet: question.codeSnippet,
          isCorrect: isCorrect,
        }}
      />
    </div>
  );
};
