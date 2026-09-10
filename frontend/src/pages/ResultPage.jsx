import React, { useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Lightbulb, 
  RotateCcw, 
  LayoutDashboard,
  Brain
} from 'lucide-react';

export const ResultPage = () => {
  const { lastAttemptResult, activeQuestion, startTopicQuestion, navigateTo } = useLearning();

  const isCorrect = lastAttemptResult?.isCorrect ?? true;

  useEffect(() => {
    if (isCorrect) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if canvas confetti fails in headless
      }
    }
  }, [isCorrect]);

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 pb-16">
      
      {/* Result Hero Card */}
      <div className={`glass-panel p-8 sm:p-12 text-center relative overflow-hidden ${
        isCorrect ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'
      }`}>
        <div className="flex flex-col items-center space-y-4">
          <span className="badge-indigo">Screen 8: Evaluation & DKT Signal Result</span>

          <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${
            isCorrect ? 'bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/30' : 'bg-rose-500/20 text-rose-400 ring-4 ring-rose-500/30'
          }`}>
            {isCorrect ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            {isCorrect ? 'Excellent Answer!' : 'Attempt Incorrect'}
          </h1>

          <p className="text-sm text-slate-300 max-w-lg">
            {isCorrect 
              ? 'Your response was accurate and submitted efficiently. The DKT model updated your topic mastery vector.'
              : 'The algorithm noted a misconception in the base condition. Difficulty is auto-adjusted for next step.'}
          </p>

          {/* DKT Mastery Update Delta */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-bold">
            <Brain className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">DKT Mastery Delta:</span>
            <span className={`font-mono ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
              {lastAttemptResult?.masteryChange >= 0 ? `+${lastAttemptResult?.masteryChange}` : lastAttemptResult?.masteryChange}%
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Response Time</span>
          <div className="flex items-center gap-2 text-xl font-bold text-white">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{lastAttemptResult?.timeTakenSec || 32} Seconds</span>
          </div>
          <p className="text-[10px] text-slate-500">Speed rating: Optimal</p>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Hints Utilized</span>
          <div className="flex items-center gap-2 text-xl font-bold text-amber-400">
            <Lightbulb className="w-4 h-4" />
            <span>{lastAttemptResult?.hintsUsedCount || 0} Hints</span>
          </div>
          <p className="text-[10px] text-slate-500">Penalty applied: {lastAttemptResult?.hintsUsedCount ? '-3%' : '0%'}</p>
        </div>

        <div className="glass-panel p-5 space-y-1">
          <span className="text-xs text-slate-400 font-semibold">Sequence Step</span>
          <div className="flex items-center gap-2 text-xl font-bold text-indigo-400">
            <TrendingUp className="w-4 h-4" />
            <span>Step #{lastAttemptResult?.questionId || 'Q18'}</span>
          </div>
          <p className="text-[10px] text-slate-500">LSTM Hidden Vector updated</p>
        </div>
      </div>

      {/* Solution & Explanation Card */}
      <div className="glass-panel p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
          <Sparkles className="w-4 h-4" /> Comprehensive AI Explanation
        </div>

        <h3 className="text-base font-bold text-white">{activeQuestion.title}</h3>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          {activeQuestion.explanation}
        </div>
      </div>

      {/* Navigation Options */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <button
          onClick={() => navigateTo('dashboard')}
          className="btn-secondary w-full sm:w-auto"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => navigateTo('revision')}
            className="btn-secondary w-full sm:w-auto text-amber-300"
          >
            <RotateCcw className="w-4 h-4" /> Spaced Revision
          </button>

          <button
            onClick={() => startTopicQuestion('recursion')}
            className="btn-primary w-full sm:w-auto"
          >
            Next AI Question <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
