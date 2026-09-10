import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { Brain, User, Mail, Lock, Hash, Target, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const { navigateTo, setUser } = useLearning();
  const [formData, setFormData] = useState({
    name: 'Chirag Pradhan',
    registerNo: '24BCE7237',
    email: 'chirag.p2024@vitstudent.ac.in',
    targetRole: 'Full Stack AI Engineer',
    password: '••••••••••••'
  });

  const handleRegister = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: formData.name,
      registerNo: formData.registerNo,
      email: formData.email,
      targetRole: formData.targetRole
    }));
    // Navigate to Screen 4 (Learning Setup Onboarding)
    navigateTo('setup');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-panel max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden shadow-2xl">
        
        {/* Left Side Info */}
        <div className="p-8 sm:p-12 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-cyan-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white">CogniPath AI</span>
            </div>
            <h2 className="mt-8 text-2xl font-bold text-white">
              Create Your Adaptive Student Profile
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Register to enable AI Knowledge Tracing (DKT). Our model will track your correctness, speed, and attempt sequence to tailor questions to your exact level.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300">
            <p className="font-bold mb-1">Deep Learning Powered</p>
            <p className="text-slate-400">Uses LSTM & GRU networks to construct topic-wise hidden state profiles.</p>
          </div>
        </div>

        {/* Right Side Register Form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-white mb-1">Register Account</h3>
          <p className="text-xs text-slate-400 mb-6">Enter your details to initialize your cognitive profile</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Register Number / ID</label>
              <div className="relative">
                <Hash className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.registerNo}
                  onChange={e => setFormData({ ...formData, registerNo: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Role / Specialization</label>
              <div className="relative">
                <Target className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full justify-center py-3 mt-4">
              Proceed to Onboarding Setup <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-xs text-slate-400 pt-2">
              Already registered?{' '}
              <button 
                type="button" 
                onClick={() => navigateTo('login')} 
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
