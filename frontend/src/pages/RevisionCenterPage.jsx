import React from 'react';
import { useLearning } from '../context/LearningContext';
import { RotateCcw, AlertTriangle, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const RevisionCenterPage = () => {
  const { revisionItems, startTopicQuestion } = useLearning();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-indigo">Screen 12: Revision Center</span>
            <span className="text-xs text-slate-400 font-mono">Spaced Repetition & Forgetting Curve</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Smart Spaced Repetition Queue</h1>
          <p className="text-sm text-slate-400 mt-1">
            Prevent cognitive decay by reviewing concepts right before forgetting occurs.
          </p>
        </div>

        <button
          onClick={() => startTopicQuestion(revisionItems[0]?.topicId || 'recursion')}
          className="btn-primary py-3 px-6 shadow-lg shadow-indigo-600/30 self-start md:self-auto"
        >
          <RotateCcw className="w-4 h-4 text-amber-300" /> Start Overdue Revision Drill
        </button>
      </div>

      {/* Forgetting Curve Banner */}
      <div className="glass-panel-glow p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" /> Cognitive Decay Alert
          </div>
          <span className="badge-rose">3 Concepts Overdue</span>
        </div>

        <h2 className="text-xl font-bold text-white">
          Recursion & Dynamic Programming reach critical 68%+ forgetting risk
        </h2>

        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Based on the sequence model, you haven't reviewed recursive call stack unwinding in 6 days. Completing a 10-minute micro-drill restores retention to 95%.
        </p>

        <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-slate-300">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            Forgetting Probability: <span className="text-rose-400 font-bold">68%</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            Optimal Review Window: <span className="text-amber-300 font-bold">Within 24 Hours</span>
          </div>
        </div>
      </div>

      {/* Spaced Repetition Items Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Review Items Queue</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {revisionItems.map(item => (
            <div key={item.id} className="glass-panel p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-indigo-400">{item.topicName}</span>
                  <span className={item.status === 'Overdue' ? 'badge-rose' : 'badge-amber'}>
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-2">{item.concept}</h3>

                <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Last Reviewed:</span>
                    <span className="text-slate-200">{item.lastReviewed}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Forgetting Risk:</span>
                    <span className="text-rose-400 font-bold">{Math.round(item.forgettingProbability * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => startTopicQuestion(item.topicId)}
                  className="btn-primary w-full justify-center py-2.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start Micro Review (8 mins)
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
