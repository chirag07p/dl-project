import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  Sparkles, 
  Brain, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Sliders, 
  RotateCcw,
  Target,
  BarChart2
} from 'lucide-react';

export const AIRecommendationPage = () => {
  const { dktState, topics, startTopicQuestion, navigateTo } = useLearning();
  const [aggressiveness, setAggressiveness] = useState('Moderate');

  const weakTopic = topics.find(t => t.mastery < 50) || topics[2];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-indigo">Screen 9: AI Recommendation Center</span>
            <span className="text-xs text-slate-400 font-mono">LSTM / GRU Model Pipeline</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Cognitive Recommendation Engine</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Inspect the internal pipeline that transforms student attempt sequences into tailored learning recommendations.
          </p>
        </div>

        <button
          onClick={() => startTopicQuestion(weakTopic.id)}
          className="btn-primary py-3 px-6 shadow-lg shadow-indigo-600/30 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" /> Accept Recommended Path
        </button>
      </div>

      {/* Visual Pipeline Flow Chart (Matching PDF System Architecture Flow) */}
      <div className="glass-panel p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400" /> DKT Dataflow & Adaptive Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="text-sm font-bold text-white">Student Interaction Input</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Captures correctness, response speed (sec), attempt retries, and hint usage.
            </p>
            <div className="pt-2 text-[10px] font-mono text-cyan-400">Sequence Len: {dktState.sequenceLength}</div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 space-y-2 ring-1 ring-indigo-500/20">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="text-sm font-bold text-white">LSTM Sequence Model</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Updates recurrent hidden state vector to estimate changing concept mastery.
            </p>
            <div className="pt-2 text-[10px] font-mono text-indigo-300">Vector size: 8 dimensions</div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="text-sm font-bold text-white">Cognitive Analysis</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluates weakness detection, forgetting threshold, and learning speed.
            </p>
            <div className="pt-2 text-[10px] font-mono text-rose-400">Weakness: {weakTopic.title}</div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-emerald-500/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs">
              04
            </div>
            <h3 className="text-sm font-bold text-white">Adaptive Recommendation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates next question, difficulty scaling (+1/-1), or revision flashcard.
            </p>
            <div className="pt-2 text-[10px] font-mono text-emerald-400">Action: Launch Quiz</div>
          </div>

        </div>
      </div>

      {/* Current AI Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Recommendation Card */}
        <div className="glass-panel-glow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-emerald">Active AI Decision</span>
            <span className="text-xs text-slate-400 font-mono">Confidence: 94.2%</span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{weakTopic.title} Drill</h3>
            <p className="text-xs text-slate-300 mt-1">
              Recommended because mastery is {weakTopic.mastery}% with {weakTopic.forgettingRisk} forgetting risk.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Concept:</span>
              <span className="text-slate-200 font-bold">Base Case & Call Stack Guard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Difficulty Adjustment:</span>
              <span className="text-indigo-300 font-bold">Level 2 (Intermediate)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Estimated Completion:</span>
              <span className="text-cyan-400 font-bold">8 Minutes</span>
            </div>
          </div>

          <button
            onClick={() => startTopicQuestion(weakTopic.id)}
            className="btn-primary w-full justify-center py-3 text-xs"
          >
            Launch This Recommended Module <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* AI Parameters & Aggressiveness Control */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" /> Model Parameter Tuning
            </h3>
          </div>

          <p className="text-xs text-slate-400">
            Control how aggressively the AI increases question difficulty when you get correct answers:
          </p>

          <div className="space-y-3 pt-2">
            {['Conservative', 'Moderate', 'Aggressive'].map(mode => (
              <div
                key={mode}
                onClick={() => setAggressiveness(mode)}
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                  aggressiveness === mode
                    ? 'bg-cyan-500/15 border-cyan-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-slate-200">{mode} Adaptation</p>
                  <p className="text-[11px] text-slate-400">
                    {mode === 'Conservative' && 'Slow difficulty steps, extra hint prompts'}
                    {mode === 'Moderate' && 'Standard sequence updates matching paper specification'}
                    {mode === 'Aggressive' && 'Fast level jumps, minimal hint prompts'}
                  </p>
                </div>
                {aggressiveness === mode && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
