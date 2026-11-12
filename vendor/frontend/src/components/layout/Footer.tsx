import React from 'react';
import { BrainIcon } from '../icons';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-8 transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white dark:bg-indigo-500">
              <BrainIcon size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Personalized Learning AI
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              College Project (Milestone A)
            </span>
          </div>

          <div className="text-center sm:text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              DSA Adaptive Learning Frontend Foundation • React + TypeScript + Vite + Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
