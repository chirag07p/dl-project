import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AiTutorDrawer } from '../ai/AiTutorDrawer';
import { BrainIcon } from '../icons';
import { useDemoLearning } from '../../context';

export const AppLayout: React.FC = () => {
  const [isAiTutorOpen, setIsAiTutorOpen] = useState(false);
  const { isBackendConnected } = useDemoLearning();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">
      <Navbar onOpenAiTutor={() => setIsAiTutorOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Floating Ask AI Tutor Button */}
      <button
        type="button"
        onClick={() => setIsAiTutorOpen(true)}
        aria-label="Ask AI Tutor"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all duration-200 hover:bg-indigo-700 hover:scale-105 active:scale-95 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      >
        <div className="relative flex items-center justify-center">
          <BrainIcon size={18} />
          {isBackendConnected && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
          )}
        </div>
        <span>Ask AI Tutor</span>
      </button>

      {/* AI Tutor Drawer */}
      <AiTutorDrawer
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
      />
    </div>
  );
};
