import React from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  BarChart, 
  RotateCcw, 
  BookOpen, 
  Play
} from 'lucide-react';

export const LandingPage = () => {
  const { navigateTo, startTopicQuestion } = useLearning();

  return (
    <div className="space-y-24 py-8 pb-20">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-12">
        {/* Glow backdrop blur pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Deep Knowledge Tracing (DKT) & Adaptive AI Tutoring</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
          Learning That Adapts to <span className="gradient-text">Your Brain's Sequence</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unlike static e-learning, our LSTM & GRU-powered AI observes your correctness, response speed, attempt counts, and hint usage to continuously personalize your learning path.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigateTo('register')}
            className="btn-primary text-base px-8 py-4 w-full sm:w-auto"
          >
            Start Free Learning Setup <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => startTopicQuestion('recursion')}
            className="btn-secondary text-base px-8 py-4 w-full sm:w-auto"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" /> Try Sample Quiz Demo
          </button>
        </div>

        {/* Live Demo Simulation Preview Card */}
        <div className="mt-16 glass-panel p-6 sm:p-8 max-w-4xl mx-auto text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-mono text-slate-300 font-semibold uppercase tracking-wider">
                Live Knowledge Tracing Engine Feed
              </span>
            </div>
            <span className="badge-indigo">Model: LSTM-DKT v2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-xs text-slate-400">Sequence Input</p>
              <p className="text-sm font-bold text-slate-200 mt-1">Q1: Recursion (Correct) → Q2: (Fail) → Q3: (Hint)</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-2">Vector state updated (+0.08)</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-xs text-slate-400">Cognitive Estimation</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-amber-400">Recursion Mastery</span>
                <span className="text-sm font-bold text-slate-200">42%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <p className="text-xs text-slate-400">AI Recommendation</p>
              <p className="text-sm font-bold text-emerald-400 mt-1">Trigger Base Case Micro-Drill</p>
              <span className="text-[10px] text-slate-400">Adjusted difficulty: Intermediate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">
            Why Static Learning Fails & How AI Solves It
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Traditional platforms treat all students identically. CogniPath AI continuously models your unique cognitive trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Deep Knowledge Tracing</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Uses recurrent sequence models (LSTM/GRU) to trace how your mastery changes question after question, not just final test marks.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Spaced Repetition & Forgetting</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Detects when older concepts are slipping from memory and automatically queues targeted revision before major failure occurs.
            </p>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Dynamic Difficulty Scaling</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              If you solve questions easily, difficulty ramps up instantly. If you struggle, step-by-step hint scaffolds are introduced.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
