import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import type { DSATopicCategory } from '../types';
import { DSA_TOPICS } from '../data/dsaTopics';
import { useDemoLearning } from '../context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import {
  CheckCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CompassIcon,
  CheckIcon,
} from '../components/icons';

export const DSATopicsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { activeTopic, setActiveTopic } = useDemoLearning();

  const [searchQuery, setSearchQuery] = useState('');
  const [manuallyFocusedCategory, setManuallyFocusedCategory] = useState<DSATopicCategory | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Compute effective focused category from URL or student click
  const focusFromUrl = searchParams.get('focus');
  const urlMatch = focusFromUrl
    ? DSA_TOPICS.find(
        (t) => t.name.toLowerCase() === focusFromUrl.toLowerCase() || t.slug === focusFromUrl.toLowerCase()
      )?.name ?? null
    : null;
  const effectiveFocusedCategory = manuallyFocusedCategory ?? urlMatch;

  const handleSelectTopic = (topicName: DSATopicCategory) => {
    setActiveTopic(topicName);
    setManuallyFocusedCategory(topicName);
    setActionFeedback(`Selected "${topicName}" as your active curriculum focus!`);
    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  // Filter topics based on search query
  const filteredTopics = DSA_TOPICS.filter((topic) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      topic.name.toLowerCase().includes(query) ||
      topic.description.toLowerCase().includes(query) ||
      topic.sampleConcepts.some((c) => c.toLowerCase().includes(query))
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header */}
      <div className="space-y-3 text-left">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Curriculum Catalogue
              </span>
              <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
              <Badge variant="default" size="sm">
                7 Foundational Categories
              </Badge>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Data Structures & Algorithms Topics
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Explore the exact 7 core DSA categories. Select any topic to set it as your active learning focus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/dashboard">
              <Button variant="outline" size="sm" leftIcon={<CompassIcon size={16} />}>
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/setup">
              <Button variant="secondary" size="sm">
                Learning Setup
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Demo Disclaimer Banner */}
      <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900 dark:border-indigo-950/80 dark:bg-indigo-950/40 dark:text-indigo-200">
        <div className="flex items-start gap-3">
          <ShieldCheckIcon size={18} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
          <div className="space-y-1">
            <strong className="font-semibold">Milestone B Scope Specification:</strong>
            <p className="text-slate-600 dark:text-slate-300">
              This catalogue displays all 7 subject categories for the application. Each topic card includes working selection actions to calibrate your active focus. Practice questions (Screen 7) and answer verification (Screen 8) are scheduled for Milestone C.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Action Feedback Alert */}
      {actionFeedback && (
        <div
          role="alert"
          className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircleIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
            <span>{actionFeedback}</span>
          </div>
          <Link to="/dashboard">
            <Button variant="primary" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
              View on Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* 4. Search and Filter Bar */}
      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search topics or concepts (e.g., Binary Search)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>Active focus:</span>
          <Badge variant="default" size="sm">
            {activeTopic}
          </Badge>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      {/* 5. The 7 DSA Topic Cards */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTopics.map((topic, index) => {
          const isActiveFocus = activeTopic === topic.name;
          const isUrlFocused = effectiveFocusedCategory === topic.name;

          return (
            <Card
              key={topic.id}
              hoverable
              className={`flex flex-col justify-between transition-all ${
                isActiveFocus
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 dark:border-indigo-500'
                  : isUrlFocused
                  ? 'border-indigo-300 dark:border-indigo-800'
                  : ''
              }`}
            >
              <div>
                {/* Header */}
                <CardHeader className="mb-3">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      0{index + 1}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isActiveFocus && (
                        <Badge variant="default" size="sm">
                          Active Focus
                        </Badge>
                      )}
                      <Badge variant="outline" size="sm">
                        {topic.estimatedConcepts} Concepts
                      </Badge>
                    </div>
                  </div>

                  <CardTitle className="mt-2 text-lg">{topic.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {topic.description}
                  </CardDescription>
                </CardHeader>

                {/* Concepts Syllabus */}
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-2xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Key Curriculum Concepts
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {topic.sampleConcepts.slice(0, 5).map((concept) => (
                        <span
                          key={concept}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-2xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {concept}
                        </span>
                      ))}
                      {topic.sampleConcepts.length > 5 && (
                        <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-2xs text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
                          +{topic.sampleConcepts.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2 text-2xs text-slate-500 dark:bg-slate-950/60 dark:text-slate-400">
                    <span>Prerequisite: <strong>{topic.recommendedPrerequisite}</strong></span>
                  </div>
                </CardContent>
              </div>

              {/* Working Actions */}
              <CardFooter className="flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row dark:border-slate-800">
                <Button
                  variant={isActiveFocus ? 'secondary' : 'outline'}
                  size="sm"
                  fullWidth
                  onClick={() => handleSelectTopic(topic.name)}
                  leftIcon={isActiveFocus ? <CheckIcon size={14} /> : undefined}
                >
                  {isActiveFocus ? 'Focus Active' : 'Set as Focus Topic'}
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => navigate(`/practice?topic=${encodeURIComponent(topic.name)}`)}
                  rightIcon={<SparklesIcon size={14} />}
                >
                  Practice
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredTopics.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No DSA topics matched your search for "{searchQuery}".
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-indigo-600 dark:text-indigo-400"
          >
            Reset Search
          </Button>
        </div>
      )}
    </div>
  );
};
