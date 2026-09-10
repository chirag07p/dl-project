import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart2, TrendingUp, Clock, CheckCircle2, Award, Download, Calendar } from 'lucide-react';

export const ProgressAnalyticsPage = () => {
  const { analytics, user } = useLearning();
  const [timeRange, setTimeRange] = useState('1W');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-indigo">Screen 11: Progress Analytics</span>
            <span className="text-xs text-slate-400 font-mono">Performance Trends</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Learning Velocity & Accuracy Trends</h1>
          <p className="text-sm text-slate-400 mt-1">
            Analyze historical question solving accuracy, average response duration, and streak momentum.
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          {['1W', '1M', 'ALL'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {range === '1W' ? '1 Week' : range === '1M' ? '1 Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Weekly Accuracy</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">78.4%</span>
            <span className="text-xs text-emerald-400 font-bold">↑ +6.2%</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Based on 142 attempts</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Average Response Time</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400">32s</span>
            <span className="text-xs text-emerald-400 font-bold">Fast (-4s)</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Optimal target &lt; 45s</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Study Time Completed</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-400">8.5 hrs</span>
            <span className="text-xs text-slate-400">This week</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Daily avg: 42 mins</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <span className="text-xs text-slate-400 font-semibold">Mastered Concepts</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">4 / 6</span>
            <span className="text-xs text-slate-400">Topics</span>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">Arrays & Strings strong</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Accuracy Line Chart */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Accuracy Rate Trend (%)
            </h2>
            <span className="text-xs text-slate-400">Daily Average</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.weeklyAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 12 }} />
                <YAxis domain={[40, 100]} stroke="#64748B" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Question Attempts Bar Chart */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-400" /> Daily Question Attempt Volume
            </h2>
            <span className="text-xs text-slate-400">Total Solved</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.weeklyAccuracy}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                <Bar dataKey="attempts" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
