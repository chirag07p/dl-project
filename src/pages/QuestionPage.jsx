import React, { useState, useEffect } from 'react';
import { useLearning } from '../context/LearningContext';
import { Clock, HelpCircle, CheckCircle2, AlertCircle, ArrowRight, Lightbulb, Code, Shield } from 'lucide-react';

export const QuestionPage = () => {
  const { activeQuestion, processDKTAttempt, navigateTo } = useLearning();
  const [selectedOption, setSelectedOption] = useState(null);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attemptsCount, setAttemptsCount] = useState(1);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRevealHint = () => {
    if (!showHint) {
      setShowHint(true);
      setHintsRevealed(prev => prev + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedOption || isSubmitting) return;

    setIsSubmitting(true);
    const chosenObj = activeQuestion.options.find(o => o.id === selectedOption);
    const isCorrect = chosenObj?.correct || false;

    // Process DKT State update
    processDKTAttempt({
      questionId: activeQuestion.id,
      topicId: activeQuestion.topicId,
      isCorrect,
      timeTakenSec: secondsElapsed,
      attemptsCount,
      hintsUsedCount: hintsRevealed
    });

    // Navigate to Result Page (Screen 8)
    setTimeout(() => {
      navigateTo('result');
    }, 400);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-6 pb-16">
      
      {/* Top Header Bar */}
      <div className="glass-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="badge-indigo">Screen 7: Focus Mode Quiz</span>
          <span className="text-xs font-semibold text-slate-300 font-mono">
            Topic: {activeQuestion.topicName}
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" />
            <span className="text-sm font-bold text-white">{formatTime(secondsElapsed)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Attempts:</span>
            <span className="font-bold text-white">{attemptsCount}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Hints Used:</span>
            <span className="font-bold text-amber-400">{hintsRevealed}</span>
          </div>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Problem & Code */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge-amber">Difficulty: {activeQuestion.difficulty}</span>
            <span className="text-xs font-mono text-slate-400">DKT Signal Input Active</span>
          </div>

          <h1 className="text-xl font-bold text-white leading-snug">
            {activeQuestion.title}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            {activeQuestion.questionText}
          </p>

          {/* Formatted Code Block */}
          {activeQuestion.codeSnippet && (
            <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><Code className="w-3.5 h-3.5" /> code_executor.js</span>
                <span>JavaScript</span>
              </div>
              <pre>{activeQuestion.codeSnippet}</pre>
            </div>
          )}

          {/* Hint Drawer */}
          {showHint && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Lightbulb className="w-4 h-4 text-amber-400" /> AI Tutor Hint
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeQuestion.hint}
              </p>
            </div>
          )}

          <div className="pt-2">
            {!showHint && (
              <button
                onClick={handleRevealHint}
                className="btn-secondary text-xs py-2 px-3 text-amber-300 border-amber-500/30 hover:bg-amber-500/10"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Reveal Hint (-3% DKT penalty)
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Options & Submit */}
        <div className="glass-panel p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Select Answer Option
            </h2>

            <div className="space-y-3">
              {activeQuestion.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 text-slate-400'
                    }`}>
                      {opt.id}
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={!selectedOption || isSubmitting}
              className={`btn-primary w-full justify-center py-3.5 text-sm ${
                !selectedOption ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Evaluating DKT Model...' : 'Submit Answer & Evaluate'} <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[11px] text-slate-500 font-mono">
              Submitting records exact response time, attempts, and hint signals to update sequence memory.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
