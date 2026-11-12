import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { DSATopicCategory, DifficultyLevel, LearningGoal } from '../types';
import { DSA_TOPICS, LEARNING_GOALS_OPTIONS } from '../data/dsaTopics';
import { useDemoLearning } from '../context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CompassIcon,
  LayersIcon,
  CheckIcon,
  BookOpenIcon,
  CodeIcon,
} from '../components/icons';

const DIFFICULTY_OPTIONS: {
  level: DifficultyLevel;
  label: string;
  description: string;
  badgeVariant: 'success' | 'warning' | 'danger';
}[] = [
  {
    level: 'Easy',
    label: 'Easy - Core Foundations',
    description: 'Direct implementations, basic loop invariants, and introductory algorithmic patterns.',
    badgeVariant: 'success',
  },
  {
    level: 'Medium',
    label: 'Medium - Standard Patterns (Recommended)',
    description: 'Multi-pointer traversals, search space partitioning, and standard interview problems.',
    badgeVariant: 'warning',
  },
  {
    level: 'Hard',
    label: 'Hard - Advanced Constraints',
    description: 'Complex multi-structure compositions, edge-case hardening, and tight asymptotic bounds.',
    badgeVariant: 'danger',
  },
];

const DAILY_TARGET_OPTIONS = [3, 5, 10];

export const LearningSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { preferences, updatePreferences } = useDemoLearning();

  const [selectedTopic, setSelectedTopic] = useState<DSATopicCategory>(preferences.initialTopic);
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal>(preferences.learningGoal);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>(preferences.preferredDifficulty);
  const [dailyTarget, setDailyTarget] = useState<number>(preferences.dailyTargetQuestions || 5);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTopic) {
      setErrorMessage('Please select an initial DSA topic to begin your curriculum.');
      return;
    }

    if (!selectedGoal) {
      setErrorMessage('Please select a learning goal.');
      return;
    }

    if (!selectedDifficulty) {
      setErrorMessage('Please choose your preferred starting difficulty.');
      return;
    }

    setErrorMessage(null);
    setSaveSuccess(true);

    updatePreferences({
      initialTopic: selectedTopic,
      learningGoal: selectedGoal,
      preferredDifficulty: selectedDifficulty,
      dailyTargetQuestions: dailyTarget,
    });

    // Seamless navigation to Dashboard with slight feedback delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickDemoSetup = () => {
    setSelectedTopic('Arrays and Strings');
    setSelectedGoal('College Coursework & Exams');
    setSelectedDifficulty('Medium');
    setDailyTarget(5);
    setErrorMessage(null);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header & Introduction */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/50 dark:text-indigo-300">
          <SparklesIcon size={14} />
          <span>Milestone B • Screen 4 of 11: Learning Setup</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Configure Your DSA Learning Experience
        </h1>
        <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-300">
          Tailor your personalized learning baseline. Choose your starting topic, learning objective, and difficulty preference.
        </p>

        {/* Demo Disclaimer */}
        <div className="mx-auto max-w-2xl rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-left text-xs text-indigo-900 dark:border-indigo-950/80 dark:bg-indigo-950/40 dark:text-indigo-200">
          <div className="flex items-start gap-2.5">
            <ShieldCheckIcon size={16} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="space-y-0.5">
              <strong className="font-semibold">Frontend Prototype Setup:</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Selections configure the frontend demo state for Dashboard and Topics navigation. Real machine learning models and server persistence are planned for subsequent milestones.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleContinue} className="mt-10 space-y-8">
        {/* Validation / Success Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <ShieldCheckIcon size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <CheckCircleIcon size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Preferences saved! Initializing your student dashboard...</span>
          </div>
        )}

        {/* Step 1: Select Initial DSA Topic */}
        <Card>
          <CardHeader>
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    1
                  </span>
                  <CardTitle className="text-lg">Select Initial DSA Topic</CardTitle>
                </div>
                <CardDescription className="mt-1">
                  Choose which of the 7 foundational DSA categories to focus on first.
                </CardDescription>
              </div>
              <Badge variant="default" size="sm">
                Selected: {selectedTopic}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DSA_TOPICS.map((topic) => {
                const isSelected = selectedTopic === topic.name;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => {
                      setSelectedTopic(topic.name);
                      setErrorMessage(null);
                    }}
                    className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {topic.name}
                        </span>
                        {isSelected ? (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
                            <CheckIcon size={12} />
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {topic.estimatedConcepts} concepts
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 dark:text-slate-400">
                        {topic.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-2xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
                      <span>Prereq: {topic.recommendedPrerequisite}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Choose Learning Goal */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                2
              </span>
              <CardTitle className="text-lg">Choose Your Learning Goal</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Specifies the primary objective and revision focus for your practice cycle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {LEARNING_GOALS_OPTIONS.map((goal) => {
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(goal.id);
                      setErrorMessage(null);
                    }}
                    className={`flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isSelected
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {goal.iconName === 'book' && <BookOpenIcon size={18} />}
                      {goal.iconName === 'code' && <CodeIcon size={18} />}
                      {goal.iconName === 'compass' && <CompassIcon size={18} />}
                      {goal.iconName === 'sparkles' && <SparklesIcon size={18} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {goal.title}
                        </span>
                        {isSelected && (
                          <span className="text-indigo-600 dark:text-indigo-400">
                            <CheckIcon size={16} />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {goal.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Difficulty & Daily Target */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                3
              </span>
              <CardTitle className="text-lg">Starting Difficulty & Pace</CardTitle>
            </div>
            <CardDescription className="mt-1">
              Calibrate your initial problem challenge rating and target daily practice intensity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Difficulty Cards */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Preferred Difficulty Level
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {DIFFICULTY_OPTIONS.map((diff) => {
                  const isSelected = selectedDifficulty === diff.level;
                  return (
                    <button
                      key={diff.level}
                      type="button"
                      onClick={() => {
                        setSelectedDifficulty(diff.level);
                        setErrorMessage(null);
                      }}
                      className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">
                            {diff.level}
                          </span>
                          <Badge variant={diff.badgeVariant} size="sm">
                            {diff.level}
                          </Badge>
                        </div>
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {diff.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                          <CheckIcon size={14} />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Daily Questions Pace */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Daily Question Commitment (Demo Target)
              </label>
              <div className="flex flex-wrap gap-3">
                {DAILY_TARGET_OPTIONS.map((target) => (
                  <button
                    key={target}
                    type="button"
                    onClick={() => setDailyTarget(target)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      dailyTarget === target
                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                        : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {target} Questions / Day
                  </button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col justify-between gap-3 sm:flex-row">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleQuickDemoSetup}
              className="text-xs text-indigo-600 dark:text-indigo-400"
            >
              Use Quick Demo Defaults
            </Button>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Link to="/topics" className="w-full sm:w-auto">
                <Button type="button" variant="outline" size="md" fullWidth leftIcon={<LayersIcon size={16} />}>
                  Browse Topics
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={saveSuccess}
                rightIcon={<ArrowRightIcon size={16} />}
              >
                {saveSuccess ? 'Saving Preferences...' : 'Save & Continue to Dashboard'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
