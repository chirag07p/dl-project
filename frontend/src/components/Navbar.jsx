import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  Brain, 
  Flame, 
  Moon, 
  Sun, 
  User, 
  Menu, 
  X, 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  BarChart2, 
  RotateCcw, 
  LogOut,
  Target
} from 'lucide-react';

export const Navbar = () => {
  const { currentScreen, navigateTo, theme, toggleTheme, user } = useLearning();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'topics', label: 'Topics', icon: BookOpen },
    { id: 'ai-recommendation', label: 'AI Recommendations', icon: Sparkles },
    { id: 'knowledge-profile', label: 'Knowledge Profile', icon: Target },
    { id: 'progress-analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'revision', label: 'Revision Center', icon: RotateCcw }
  ];

  const handleNavClick = (screenId) => {
    navigateTo(screenId);
    setMobileMenuOpen(false);
  };

  // Hide nav on full focus pages if desired or show top light bar
  const isAuthPage = ['landing', 'login', 'register', 'setup'].includes(currentScreen);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => handleNavClick(isAuthPage ? 'landing' : 'dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              CogniPath<span className="text-indigo-400">.AI</span>
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-widest text-indigo-400/90 font-mono -mt-1">
              Adaptive Knowledge Engine
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links (Show when logged in/past setup) */}
        {!isAuthPage && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Section: Streak, Theme Toggle, Profile */}
        <div className="flex items-center gap-3">
          {!isAuthPage && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="text-xs font-bold text-amber-300">
                {user.currentStreakDays} Days Streak
              </span>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Profile / Auth Button */}
          {isAuthPage ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick('login')}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="btn-primary text-sm px-4 py-2"
              >
                Get Started
              </button>
            </div>
          ) : (
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-3 pl-2 border-l border-slate-800 cursor-pointer group"
            >
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-9 h-9 rounded-full ring-2 ring-indigo-500/30 group-hover:ring-indigo-500 transition-all object-cover" 
              />
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {user.registerNo}
                </p>
              </div>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          {!isAuthPage && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && !isAuthPage && (
        <div className="lg:hidden bg-slate-900/95 border-b border-slate-800 px-4 py-4 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between px-2">
            <span className="text-xs text-slate-400">Signed in as {user.name}</span>
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-1 text-xs text-rose-400 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
