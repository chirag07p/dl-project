import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDemoLearning } from '../context';
import { DSA_TOPICS } from '../data/dsaTopics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  BookOpenIcon,
  LayersIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CompassIcon,
} from '../components/icons';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    preferences,
    activeTopic,
    topicProgress,
    studentProfile,
    resetDemoData,
    setActiveTopic,
    isBackendConnected,
    livePipelineData,
  } = useDemoLearning();

  // Find detailed info for the active topic
  const activeTopicDetails = DSA_TOPICS.find((t) => t.name === activeTopic) || DSA_TOPICS[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Header & Student Identity */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Student Hub
            </span>
            <span className="text-xs text-slate-300 dark:text-slate-700">•</span>
            {isBackendConnected ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                PyTorch DKT Live
              </span>
            ) : (
              <Badge variant="default" size="sm">
                Milestone C Active
              </Badge>
            )}
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Welcome back, {studentProfile.fullName}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {studentProfile.academicLevel || 'Undergraduate Student'} • Adaptive DSA Learning Dashboard
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/setup">
            <Button variant="outline" size="sm" leftIcon={<CompassIcon size={16} />}>
              Adjust Setup
            </Button>
          </Link>
          <Link to="/topics">
            <Button variant="primary" size="sm" rightIcon={<ArrowRightIcon size={16} />}>
              Explore All Topics
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Backend Live Status or Demo Simulation Notice */}
      {isBackendConnected && livePipelineData ? (
        <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shrink-0 mt-0.5 font-bold">
              ✓
            </div>
            <div className="space-y-1">
              <strong className="font-semibold text-emerald-800 dark:text-emerald-300">
                PyTorch Deep Knowledge Tracing Backend Live:
              </strong>
              <p className="text-slate-600 dark:text-slate-300">
                Connected to Python REST API (port 5000). Real-time LSTM inference active.
                Overall DKT Knowledge Mastery: <strong>{(livePipelineData.profile.overall_mastery * 100).toFixed(1)}%</strong> across {livePipelineData.profile.total_questions_solved} solved interactions.
                {livePipelineData.weaknesses.length > 0 && (
                  <span className="block mt-1 font-medium text-amber-700 dark:text-amber-300">
                    ⚠️ AI Weakness Alert: {livePipelineData.weaknesses[0].topic_name} — {livePipelineData.weaknesses[0].reason}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-xs text-indigo-900 dark:border-indigo-950/80 dark:bg-indigo-950/40 dark:text-indigo-200">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon size={18} className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
            <div className="space-y-1">
              <strong className="font-semibold">Frontend Local Mode (Backend Disconnected):</strong>
              <p className="text-slate-600 dark:text-slate-300">
                Running in client fallback mode. To enable live PyTorch DKT LSTM neural network tracking and interactive AI tutoring, start the backend server with <code>python server.py</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Summary Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Active Focus Topic */}
        <Card>
          <CardHeader className="mb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Focus Topic
            </CardDescription>
            <CardTitle className="text-lg text-indigo-600 dark:text-indigo-400">
              {activeTopic}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>{activeTopicDetails.estimatedConcepts} concepts in curriculum</p>
            <p className="text-slate-400">Prereq: {activeTopicDetails.recommendedPrerequisite}</p>
          </CardContent>
        </Card>

        {/* Learning Goal */}
        <Card>
          <CardHeader className="mb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Learning Objective
            </CardDescription>
            <CardTitle className="text-lg">
              {preferences.learningGoal}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>Targeting structured semester mastery</p>
            <p className="text-slate-400">Configured in Learning Setup</p>
          </CardContent>
        </Card>

        {/* Calibrated Starting Difficulty */}
        <Card>
          <CardHeader className="mb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Starting Difficulty
            </CardDescription>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{preferences.preferredDifficulty}</CardTitle>
              <Badge
                variant={
                  preferences.preferredDifficulty === 'Easy'
                    ? 'success'
                    : preferences.preferredDifficulty === 'Medium'
                    ? 'warning'
                    : 'danger'
                }
                size="sm"
              >
                {preferences.preferredDifficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>Dynamic difficulty adjusts per question</p>
            <p className="text-slate-400">Daily target: {preferences.dailyTargetQuestions} questions</p>
          </CardContent>
        </Card>

        {/* Milestone Roadmap Status */}
        <Card>
          <CardHeader className="mb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Milestone Status
            </CardDescription>
            <CardTitle className="text-lg text-emerald-600 dark:text-emerald-400">
              Screens 1 - 6 Active
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
            <p>Onboarding & catalog screens active</p>
            <p className="text-slate-400">Practice questions in Milestone C</p>
          </CardContent>
        </Card>
      </div>

      {/* 4. Recommended Next Action (Main Highlight) */}
      <section className="mt-8">
        <Card className="border-indigo-200 bg-linear-to-r from-indigo-50/70 to-white dark:border-indigo-900/60 dark:from-indigo-950/30 dark:to-slate-900">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="default" size="sm">
                  Recommended Next Action (Demo Simulation)
                </Badge>
                <Badge variant="outline" size="sm">
                  Focus: {activeTopic}
                </Badge>
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                Next Challenge: {activeTopicDetails.sampleConcepts[0]} ({preferences.preferredDifficulty})
              </h2>

              <p className="max-w-2xl text-xs text-slate-600 sm:text-sm dark:text-slate-300">
                Recommended based on your curriculum setup for <strong>{preferences.learningGoal}</strong>. Practicing foundational invariant techniques strengthens your baseline before moving into non-linear topics.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>Concepts covered so far: <strong>3 of 8</strong></span>
                <span>•</span>
                <span>Estimated duration: <strong>15 mins</strong></span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row md:flex-col shrink-0">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate(`/practice?topic=${encodeURIComponent(activeTopic)}`)}
                rightIcon={<SparklesIcon size={16} />}
              >
                Start Practice Session
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate(`/topics?focus=${encodeURIComponent(activeTopic)}`)}
                leftIcon={<BookOpenIcon size={16} />}
              >
                Inspect Topic Syllabus
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* 5. Topic Progress Breakdown */}
      <section className="mt-10 space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <LayersIcon size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Progression</span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              7 DSA Topic Categories Progress
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Simulated completion metrics across the foundational computer science curriculum.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetDemoData}
              className="text-xs text-slate-500 dark:text-slate-400"
            >
              Reset Demo Data
            </Button>
            <Link to="/topics">
              <Button variant="outline" size="sm" rightIcon={<ArrowRightIcon size={14} />}>
                View All Topics
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {topicProgress.map((item) => {
              const percentage = Math.round((item.completedConcepts / item.totalConcepts) * 100);
              const isActive = item.topic === activeTopic;

              return (
                <div
                  key={item.topic}
                  className={`flex flex-col justify-between gap-4 p-4 transition-colors sm:flex-row sm:items-center ${
                    isActive
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="space-y-1 sm:max-w-md">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.topic}
                      </span>
                      {isActive && (
                        <Badge variant="default" size="sm">
                          Active Focus
                        </Badge>
                      )}
                      <Badge
                        variant={
                          item.status === 'In Progress'
                            ? 'warning'
                            : item.status === 'Up Next'
                            ? 'neutral'
                            : 'outline'
                        }
                        size="sm"
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Key Concepts: {item.sampleConcepts.join(', ')}
                    </p>
                  </div>

                  {/* Progress Bar & Actions */}
                  <div className="flex items-center gap-4 sm:w-72 justify-between sm:justify-end">
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-2xs text-slate-500 dark:text-slate-400">
                        <span>{item.completedConcepts}/{item.totalConcepts} concepts</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-600 transition-all dark:bg-indigo-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link to={`/practice?topic=${encodeURIComponent(item.topic)}`}>
                        <Button variant="primary" size="sm" className="text-xs">
                          Practice
                        </Button>
                      </Link>
                      {!isActive && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTopic(item.topic)}
                          className="text-xs text-indigo-600 dark:text-indigo-400"
                        >
                          Focus
                        </Button>
                      )}
                      <Link to={`/topics?focus=${encodeURIComponent(item.topic)}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
