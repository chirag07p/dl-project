import React from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { Target, Brain, ArrowRight, TrendingUp, CheckCircle2, AlertTriangle } from 'lucide-react';

export const KnowledgeProfilePage = () => {
  const { topics, analytics, dktState, startTopicQuestion } = useLearning();

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-indigo">Screen 10: Knowledge Profile</span>
            <span className="text-xs text-slate-400 font-mono">Cognitive Matrix & Skill Radar</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Student Knowledge Profile</h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time radar analysis comparing individual mastery vectors with benchmark expectations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="badge-emerald">Status: Active Tracing</span>
        </div>
      </div>

      {/* Charts Row: Radar Chart & LSTM Hidden State Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Skill Radar */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" /> Topic Mastery Radar Chart
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-indigo-400">■ Student</span>
              <span className="flex items-center gap-1 text-cyan-400">■ Benchmark</span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analytics.radarSkillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="concept" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Student" dataKey="student" stroke="#6366F1" fill="#6366F1" fillOpacity={0.4} />
                <Radar name="Benchmark" dataKey="benchmark" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.15} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: LSTM Hidden State Evolution */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" /> DKT Hidden State Trajectory
            </h2>
            <span className="text-xs text-slate-400 font-mono">Last 7 Interactions</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.hiddenStateTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="attempt" stroke="#64748B" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#64748B" tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="predictedMastery" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Concept Matrix Table */}
      <div className="glass-panel p-6 space-y-4">
        <h2 className="text-lg font-bold text-white">Concept Skill Matrix</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="p-3">Topic Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Mastery Level</th>
                <th className="p-3">Status</th>
                <th className="p-3">Forgetting Risk</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topics.map(t => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-bold text-slate-200">{t.title}</td>
                  <td className="p-3 text-slate-400 font-mono">{t.category}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{t.mastery}%</span>
                      <div className="w-20 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${t.mastery}%`, backgroundColor: t.color }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={t.mastery >= 80 ? 'badge-emerald' : t.mastery >= 50 ? 'badge-indigo' : 'badge-rose'}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{t.forgettingRisk}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => startTopicQuestion(t.id)}
                      className="px-3 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Practice →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
