import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrainIcon, MenuIcon, XIcon, SparklesIcon } from '../icons';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Badge } from '../ui/Badge';
import { useDemoLearning } from '../../context';

interface NavbarProps {
  onOpenAiTutor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiTutor }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isBackendConnected } = useDemoLearning();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 transition-opacity hover:opacity-90 dark:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs dark:bg-indigo-500">
              <BrainIcon size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                Personalized Learning AI
              </span>
              <span className="hidden text-xs text-slate-500 sm:inline-block dark:text-slate-400">
                Adaptive DSA Learning
              </span>
            </div>
          </Link>
          {isBackendConnected ? (
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              PyTorch DKT Online
            </span>
          ) : (
            <Badge variant="default" size="sm" className="hidden md:inline-flex">
              Milestone C Active
            </Badge>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 lg:gap-5 md:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              location.pathname === '/'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Overview
          </Link>

          <Link
            to="/dashboard"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              location.pathname === '/dashboard'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/topics"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              location.pathname === '/topics'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            DSA Topics
          </Link>

          <Link
            to="/practice"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              location.pathname.startsWith('/practice') || location.pathname === '/result'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Practice
          </Link>

          <Link
            to="/setup"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              location.pathname === '/setup'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Learning Setup
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Authentication Links */}
          <Link
            to="/login"
            className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
              location.pathname === '/login'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Sign In
          </Link>
          <Link to="/register">
            <span
              className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors text-xs px-3 py-1.5 gap-1.5 ${
                location.pathname === '/register'
                  ? 'bg-indigo-700 text-white dark:bg-indigo-600'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
              }`}
            >
              Register
            </span>
          </Link>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
          {onOpenAiTutor && (
            <button
              type="button"
              onClick={onOpenAiTutor}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <SparklesIcon size={14} />
              <span>Ask AI</span>
            </button>
          )}
          <ThemeToggle />
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {mobileMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <nav className="flex flex-col space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Overview
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Dashboard
            </Link>
            <Link
              to="/topics"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              DSA Topics (7 Categories)
            </Link>
            <Link
              to="/practice"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Practice Questions
            </Link>
            <Link
              to="/setup"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Learning Setup
            </Link>

            <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              Sign In (Login)
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
            >
              Register (Create Account)
            </Link>

            <div className="pt-2">
              <Badge variant="default" size="sm">
                Milestone C Active (Practice)
              </Badge>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
