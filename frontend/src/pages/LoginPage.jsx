import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { Brain, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage = () => {
  const { navigateTo, setUser } = useLearning();
  const [email, setEmail] = useState('chirag.p2024@vitstudent.ac.in');
  const [password, setPassword] = useState('••••••••••••');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate login success
    setUser(prev => ({ ...prev, email }));
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-panel max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl">
        
        {/* Left Side: Brand Showcase */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-cyan-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">CogniPath AI</span>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-white">
              Welcome Back to Your Personal Learning Engine
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Resume your adaptive study track. Your DKT model state has preserved your topic mastery history.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-time Knowledge Vector Tracking</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Spaced Repetition & Weakness Detection</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-2">Sign In</h3>
          <p className="text-xs text-slate-400 mb-6">Enter your student credentials to access your dashboard</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button type="button" className="text-[11px] text-indigo-400 hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0" />
                <span>Keep me signed in</span>
              </label>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3">
              Sign In to Dashboard <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-slate-400 pt-4">
              Don't have an account?{' '}
              <button 
                type="button" 
                onClick={() => navigateTo('register')} 
                className="text-indigo-400 font-semibold hover:underline"
              >
                Register Here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
