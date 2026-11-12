import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DSA_TOPICS, APP_SCREENS, LEARNING_WORKFLOW_STAGES } from '../data/dsaTopics';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import {
  BrainIcon,
  BookOpenIcon,
  LayersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  CompassIcon,
  ShieldCheckIcon,
  CodeIcon,
} from '../components/icons';

export const LandingPage: React.FC = () => {
  // Demonstration state for UI component testing
  const [testInput, setTestInput] = useState('');
  const [testCategory, setTestCategory] = useState(DSA_TOPICS[0].id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* 1. Hero Section */}
      <section id="overview" className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-xs sm:px-12 sm:py-16 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-800/80 dark:bg-indigo-950/50 dark:text-indigo-300">
            <BrainIcon size={14} />
            <span>Personalized Learning AI • Milestone C (Screens 1 - 8 Active)</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Personalized Learning AI
          </h1>

          <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            An adaptive learning web application engineered for Data Structures & Algorithms. Built on a clean React, TypeScript, Vite, and Tailwind CSS architecture.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/practice">
              <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />}>
                Start Adaptive Practice
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" leftIcon={<CompassIcon size={16} />}>
                Student Dashboard
              </Button>
            </Link>
            <Link to="/topics">
              <Button variant="outline" leftIcon={<LayersIcon size={16} />}>
                DSA Topics Catalogue
              </Button>
            </Link>
            <Link to="/setup">
              <Button variant="outline">
                Learning Setup
              </Button>
            </Link>
          </div>

          {/* Foundation Status Alert */}
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-indigo-100 p-1 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                <ShieldCheckIcon size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Engineering Scope Status
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
                  Milestone A establishes the clean frontend architecture, shared layout, design system tokens, and theme foundation. Adaptive models and backend services are scheduled for subsequent milestones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DSA Topics Scope Section */}
      <section id="topics" className="mt-14 space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BookOpenIcon size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Curriculum Scope</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              DSA Topic Categories
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The first version of Personalized Learning AI is structured across 7 foundational topics.
            </p>
          </div>
          <Badge variant="neutral" size="md">
            7 Focus Categories
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DSA_TOPICS.map((topic, index) => (
            <Card key={topic.id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    0{index + 1}
                  </span>
                  <Badge variant="default" size="sm">
                    {topic.estimatedConcepts} Key Concepts
                  </Badge>
                </div>
                <CardTitle className="text-base">{topic.name}</CardTitle>
                <CardDescription className="mt-2 text-xs">
                  {topic.description}
                </CardDescription>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <span>Slug: <code className="text-indigo-600 dark:text-indigo-400">{topic.slug}</code></span>
                <span className="font-medium text-slate-700 dark:text-slate-300">Ready for Milestone B</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 3. Original Learning Workflow Section */}
      <section id="workflow" className="mt-14 space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <CompassIcon size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Pedagogical Framework</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Adaptive Learning Cycle
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              The application preserves the original student learning and recommendation workflow.
            </p>
          </div>
          <Badge variant="success" size="md">
            6 Closed-Loop Steps
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {LEARNING_WORKFLOW_STAGES.map((stage) => (
            <Card key={stage.step} className="relative">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-2xs dark:bg-indigo-500">
                  {stage.step}
                </span>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {stage.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. Screen Architecture Roadmap */}
      <section id="roadmap" className="mt-14 space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <LayersIcon size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">System Roadmap</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              11 Application Screens Architecture
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Strict delivery boundaries: exactly 11 planned screens across project milestones.
            </p>
          </div>
          <Badge variant="neutral" size="md">
            6 Active • 5 Planned
          </Badge>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {APP_SCREENS.map((screen) => (
              <div
                key={screen.id}
                className="flex flex-col justify-between gap-2 p-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center dark:hover:bg-slate-800/50"
              >
                <div className="flex items-start gap-3 sm:items-center">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    {screen.stepNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {screen.name}
                      </span>
                      <code className="text-xs text-slate-400 dark:text-slate-500">
                        {screen.route}
                      </code>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {screen.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {screen.id === 'landing' ? (
                    <Badge variant="success" size="sm">
                      Active (Milestone A)
                    </Badge>
                  ) : screen.status === 'active' ? (
                    <Link to={screen.route}>
                      <Badge variant="success" size="sm" className="hover:opacity-80">
                        Active (Milestone B) →
                      </Badge>
                    </Link>
                  ) : (
                    <Badge variant="outline" size="sm">
                      Milestone {screen.plannedMilestone}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Design System Component Verification */}
      <section className="mt-14 space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <CodeIcon size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Design System</span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Reusable UI Component Library
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Verified components adhering to light/dark themes, accessibility, and clean typography.
            </p>
          </div>
          <Badge variant="default" size="md">
            Verified Components
          </Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Button Variants */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Buttons & Actions</CardTitle>
              <CardDescription>
                Primary, secondary, outline, ghost, and danger variants with sizing and icon support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Primary SM</Button>
                <Button variant="primary" size="md">Primary MD</Button>
                <Button variant="secondary" size="md">Secondary</Button>
                <Button variant="outline" size="md">Outline</Button>
                <Button variant="ghost" size="md">Ghost</Button>
                <Button variant="danger" size="md">Danger</Button>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Supports disabled states, full-width, and left/right icon slots
              </span>
            </CardFooter>
          </Card>

          {/* Form Inputs & Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Form Controls</CardTitle>
              <CardDescription>
                Accessible Input and Select components with label, helper, and validation states.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Input
                  label="Sample Search / Input"
                  placeholder="e.g. Binary Search"
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  helperText="Interactive test input for design verification."
                />
                <Select
                  label="Sample Topic Selector"
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  options={DSA_TOPICS.map((t) => ({ value: t.id, label: t.name }))}
                />
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Selected: <strong className="text-indigo-600 dark:text-indigo-400">{testCategory}</strong>
              </span>
            </CardFooter>
          </Card>

          {/* Badges & Status Indicators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Semantic Badges</CardTitle>
              <CardDescription>
                Status indicators for topics, difficulty ratings, and milestones.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="neutral">Neutral</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Used for difficulty levels (Easy/Medium/Hard) and workflow status
              </span>
            </CardFooter>
          </Card>

          {/* Foundation Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Milestone A Checklist</CardTitle>
              <CardDescription>
                Verification of deliverables completed in this initial setup.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircleIcon size={16} />
                  <span>Vite + React 19 + TypeScript + Tailwind CSS initialized</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircleIcon size={16} />
                  <span>React Router configured with AppLayout</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircleIcon size={16} />
                  <span>Design system tokens and reusable UI components established</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircleIcon size={16} />
                  <span>Light theme default with persistent dark mode toggle</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircleIcon size={16} />
                  <span>Zero compilation or build warnings</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Badge variant="success" size="sm">
                Ready for Milestone B Review
              </Badge>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
};
