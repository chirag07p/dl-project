import React from 'react';
import { Brain, Github, Shield, Cpu, BookOpen } from 'lucide-react';
import { useLearning } from '../context/LearningContext';

export const Footer = () => {
  const { navigateTo } = useLearning();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Col 1: Brand & Team */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">CogniPath AI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            An Adaptive Deep Learning-Based Student Learning & Recommendation System utilizing Deep Knowledge Tracing (DKT), sequence modeling (LSTM/GRU), and continuous cognitive estimation.
          </p>
          <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs space-y-1">
            <p className="font-semibold text-slate-300">Project Research Team:</p>
            <p className="text-slate-400 font-mono">Chirag Pradhan (24BCE7237) • Darga Syed Javid (24BCA7689)</p>
            <p className="text-slate-400 font-mono">Shaik Mansoor (24BCA7204) • Boyina Arunkamal (24BCA7881)</p>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200">Platform Features</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => navigateTo('dashboard')} className="hover:text-indigo-400 transition-colors">Student Dashboard</button></li>
            <li><button onClick={() => navigateTo('topics')} className="hover:text-indigo-400 transition-colors">Topic Catalogue</button></li>
            <li><button onClick={() => navigateTo('ai-recommendation')} className="hover:text-indigo-400 transition-colors">AI Recommendation Pipeline</button></li>
            <li><button onClick={() => navigateTo('knowledge-profile')} className="hover:text-indigo-400 transition-colors">Knowledge Profile Radar</button></li>
            <li><button onClick={() => navigateTo('revision')} className="hover:text-indigo-400 transition-colors">Spaced Repetition Queue</button></li>
          </ul>
        </div>

        {/* Col 3: Research Foundations */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-200">Research Models</h4>
          <ul className="space-y-2 text-xs">
            <li className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> Deep Knowledge Tracing (DKT)</li>
            <li className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Bayesian Knowledge Tracing (BKT)</li>
            <li className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-400" /> Item Response Theory (IRT)</li>
            <li className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-amber-400" /> Dynamic Key-Value Networks</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 CogniPath AI. Adaptive Student Recommendation Engine.</p>
        <p className="font-mono text-indigo-400">Deep Learning First Review Project</p>
      </div>
    </footer>
  );
};
