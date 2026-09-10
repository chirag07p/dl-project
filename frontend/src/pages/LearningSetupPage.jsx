import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { Brain, CheckCircle2, ArrowRight, ArrowLeft, Target, Clock, Zap, BookOpen, Sparkles } from 'lucide-react';

export const LearningSetupPage = () => {
  const { navigateTo, setUser } = useLearning();
  const [step, setStep] = useState(1);
  const [selectedSubject, setSelectedSubject] = useState('dsa');
  const [dailyGoal, setDailyGoal] = useState(45);
  const [learningStyle, setLearningStyle] = useState('hands-on');
  const [baselineLevel, setBaselineLevel] = useState('intermediate');

  const subjects = [
    { id: 'dsa', name: 'Data Structures & Algorithms', desc: 'Arrays, Recursion, Trees, Graphs, DP', icon: BookOpen },
    { id: 'dl', name: 'Deep Learning & Neural Networks', desc: 'LSTM, GRU, DKT, Knowledge Tracing', icon: Brain },
    { id: 'sys', name: 'Computer Systems & Architecture', desc: 'Memory Management, Operating Systems', icon: Target }
  ];

  const handleFinishSetup = () => {
    setUser(prev => ({
      ...prev,
      dailyGoalMinutes: dailyGoal,
      learningStyle: learningStyle === 'hands-on' ? 'Visual & Practical Hands-on' : 'Theoretical First'
    }));
    navigateTo('dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Wizard Progress Bar */}
      <div className="mb-10 text-center space-y-4">
        <span className="badge-indigo">Screen 4: Learning Setup & Initial Baseline</span>
        <h1 className="text-3xl font-extrabold text-white">Configure Your AI Tutor Baseline</h1>
        <p className="text-sm text-slate-400">Step {step} of 3 — Tailoring adaptive sequence parameters</p>
        
        <div className="flex items-center justify-center gap-2 max-w-md mx-auto pt-2">
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              className={`h-2 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-indigo-600 shadow-md shadow-indigo-600/30' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="glass-panel p-8 sm:p-12 relative overflow-hidden">
        
        {/* Step 1: Subject Focus Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Select Primary Learning Track
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {subjects.map(s => {
                const Icon = s.icon;
                const isSelected = selectedSubject === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id)}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mb-3 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <h3 className="font-bold text-sm text-white">{s.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-end pt-6">
              <button onClick={() => setStep(2)} className="btn-primary">
                Next: Daily Goals <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Daily Goal & Pace */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" /> Daily Target & Pace Settings
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-300">Daily Learning Commitment (Minutes)</label>
              <div className="grid grid-cols-3 gap-4">
                {[30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    onClick={() => setDailyGoal(mins)}
                    className={`py-4 rounded-xl border text-sm font-bold transition-all ${
                      dailyGoal === mins
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    {mins} Minutes / Day
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <label className="block text-sm font-semibold text-slate-300">Preferred Practice Style</label>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setLearningStyle('hands-on')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    learningStyle === 'hands-on'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-sm">Interactive Code Tracing</p>
                  <p className="text-xs text-slate-400 mt-1">Focus on step-by-step problem execution</p>
                </div>
                <div
                  onClick={() => setLearningStyle('theory')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    learningStyle === 'theory'
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <p className="font-bold text-sm">Concept Flashcards First</p>
                  <p className="text-xs text-slate-400 mt-1">Focus on definitions & formula derivation</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-800">
              <button onClick={() => setStep(1)} className="btn-secondary">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} className="btn-primary">
                Next: Baseline Diagnostic <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Self-Assessed Baseline */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> Self-Assessed Skill Baseline
            </h2>

            <p className="text-sm text-slate-400">
              Select where you currently feel your knowledge starts. The AI model will initialize your baseline vector accordingly:
            </p>

            <div className="space-y-3">
              {[
                { id: 'beginner', title: 'Beginner', desc: 'Familiar with basic loops and syntax, starting data structures' },
                { id: 'intermediate', title: 'Intermediate (Recommended)', desc: 'Comfortable with Arrays & Strings, working on Recursion & Trees' },
                { id: 'advanced', title: 'Advanced', desc: 'Mastered standard structures, ready for Dynamic Programming & Graphs' }
              ].map(lvl => (
                <div
                  key={lvl.id}
                  onClick={() => setBaselineLevel(lvl.id)}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    baselineLevel === lvl.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-slate-200">{lvl.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lvl.desc}</p>
                  </div>
                  {baselineLevel === lvl.id && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6 border-t border-slate-800">
              <button onClick={() => setStep(2)} className="btn-secondary">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleFinishSetup} className="btn-primary bg-gradient-to-r from-indigo-600 to-cyan-500">
                Complete Setup & Launch Dashboard <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
