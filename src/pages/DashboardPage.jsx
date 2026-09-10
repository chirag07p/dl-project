import React from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Play, 
  BookOpen, 
  Clock,
  RotateCcw,
  BarChart2
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, topics, dktState, navigateTo, startTopicQuestion } = useLearning();

  const weakTopics = topics.filter(t => t.mastery < 50);
  const recommendedTopic = topics.find(t => t.recommended) || topics[2];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-cyan-950/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge-indigo">Screen 5: Student Dashboard</span>
              <span className="text-xs text-slate-400 font-mono">Register No: {user.registerNo}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user.name}</span>!
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Your AI tutor is actively tracking your response patterns. Overall concept mastery is currently estimated at <strong className="text-indigo-400">{user.overallMastery}%</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startTopicQuestion(recommendedTopic.id)}
              className="btn-primary py-3 px-6 shadow-lg shadow-indigo-600/30"
            >
              <Play className="w-4 h-4 fill-white" /> Start AI Suggested Quiz
            </button>
            <button
              onClick={() => navigateTo('ai-recommendation')}
              className="btn-secondary py-3 px-4"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" /> AI Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Overall Mastery</span>
            <Brain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{user.overallMastery}%</span>
            <span className="text-xs text-emerald-400 font-semibold">↑ +4% this week</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${user.overallMastery}%` }}></div>
          </div>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Questions Solved</span>
            <Award className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{user.totalQuestionsSolved}</span>
            <span className="text-xs text-slate-400">Questions</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">Accuracy Rate: 78.4%</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{user.currentStreakDays}</span>
            <span className="text-xs text-amber-300 font-semibold">Days Active</span>
          </div>
          <p className="text-[11px] text-slate-400">Target: {user.dailyGoalMinutes} min/day</p>
        </div>

        <div className="glass-panel p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">DKT Sequence Vector</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">{dktState.sequenceLength}</span>
            <span className="text-xs text-slate-400">Interactions</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">LSTM state updated</p>
        </div>
      </div>

      {/* AI Recommendation Banner & Weakness Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: AI Recommendation Highlight */}
        <div className="lg:col-span-2 glass-panel-glow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white">AI Recommended Action</h2>
            </div>
            <span className="badge-indigo">Priority: High</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Target Weakness</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{recommendedTopic.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Model indicates high forgetting risk ({recommendedTopic.forgettingRisk}) & lowest accuracy on call stack base cases.
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-rose-400">{recommendedTopic.mastery}%</span>
                <p className="text-[10px] text-slate-500">Mastery Level</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-indigo-400" /> ~10 Mins</span>
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-cyan-400" /> 5 Questions</span>
              </div>
              <button 
                onClick={() => startTopicQuestion(recommendedTopic.id)}
                className="btn-primary py-2 px-5 text-xs"
              >
                Start Recommended Drill <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Weakness Alerts */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-bold text-white">Weakness Alerts</h2>
          </div>
          <div className="space-y-3">
            {weakTopics.map(wt => (
              <div key={wt.id} className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-200">{wt.title}</p>
                  <p className="text-xs text-rose-300">Mastery: {wt.mastery}% ({wt.forgettingRisk})</p>
                </div>
                <button
                  onClick={() => startTopicQuestion(wt.id)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors"
                >
                  Fix
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Progress Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Topic Knowledge Breakdown</h2>
          <button 
            onClick={() => navigateTo('topics')} 
            className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Topics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topics.map(t => (
            <div key={t.id} className="glass-panel p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">{t.category}</span>
                <span className={t.mastery >= 80 ? 'badge-emerald' : t.mastery >= 50 ? 'badge-indigo' : 'badge-rose'}>
                  {t.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-base">{t.title}</h3>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Mastery Level</span>
                  <span className="text-indigo-300 font-bold">{t.mastery}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${t.mastery}%`,
                      backgroundColor: t.color || '#6366F1'
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">{t.completedQuestions}/{t.totalQuestions} Questions</span>
                <button
                  onClick={() => startTopicQuestion(t.id)}
                  className="text-indigo-400 font-semibold hover:text-indigo-300"
                >
                  Practice →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
