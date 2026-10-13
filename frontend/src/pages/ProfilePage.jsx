import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { User, Brain, Sliders, Moon, Sun, RotateCcw, Save, LogOut, CheckCircle2, Shield, Hash } from 'lucide-react';

export const ProfilePage = () => {
  const { user, setUser, navigateTo, theme, toggleTheme } = useLearning();
  const [activeTab, setActiveTab] = useState('personal');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: user.name,
    registerNo: user.registerNo,
    email: user.email,
    targetRole: user.targetRole,
    dailyGoalMinutes: user.dailyGoalMinutes
  });

  const handleSave = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: formData.name,
      registerNo: formData.registerNo,
      email: formData.email,
      targetRole: formData.targetRole,
      dailyGoalMinutes: Number(formData.dailyGoalMinutes)
    }));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8 pb-16">
      
      {/* Profile Header Banner */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-indigo-900/30 to-slate-900">
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-24 h-24 rounded-full ring-4 ring-indigo-500/40 object-cover shadow-xl"
        />
        
        <div className="text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="badge-indigo">Screen 13: Student Profile & Settings</span>
            <span className="text-xs text-slate-400 font-mono">Reg No: {user.registerNo}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
          <p className="text-xs text-indigo-300 font-medium">{user.targetRole}</p>
          <p className="text-xs text-slate-400 font-mono pt-1">{user.email}</p>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'personal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Academic Details
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          AI Model Parameters
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preferences' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Preferences & Theme
        </button>
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSave} className="glass-panel p-6 sm:p-8 space-y-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" /> Academic & Personal Profile
          </h2>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Student Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Register Number</label>
              <input
                type="text"
                value={formData.registerNo}
                onChange={e => setFormData({ ...formData, registerNo: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Specialization</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigateTo('landing')}
              className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 hover:underline"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>

            <button type="submit" className="btn-primary text-xs py-2.5 px-6">
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: AI Model Controls */}
      {activeTab === 'ai' && (
        <div className="glass-panel p-6 sm:p-8 space-y-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" /> AI Knowledge Vector Controls
          </h2>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <p className="font-bold text-slate-200">Current DKT State Statistics</p>
            <p className="text-slate-400">Sequence interactions tracked: <strong className="text-indigo-400">18 items</strong></p>
            <p className="text-slate-400">Hidden vector model: <strong className="text-cyan-400">LSTM-8D</strong></p>
          </div>

          <button
            onClick={() => alert("DKT Hidden State Vector successfully reset to diagnostic baseline.")}
            className="btn-secondary text-xs text-amber-300 border-amber-500/30"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset DKT Sequence Model State
          </button>
        </div>
      )}

      {/* Tab 3: System Preferences */}
      {activeTab === 'preferences' && (
        <div className="glass-panel p-6 sm:p-8 space-y-6 animate-fadeIn">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" /> System & Theme Preferences
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <p className="font-bold text-sm text-white">Color Theme</p>
              <p className="text-xs text-slate-400">Current mode: {theme === 'dark' ? 'Dark Slate' : 'Light Pearl'}</p>
            </div>
            <button onClick={toggleTheme} className="btn-secondary text-xs">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
