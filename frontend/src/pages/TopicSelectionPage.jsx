import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { Search, Filter, BookOpen, Sparkles, ArrowRight, CheckCircle2, Play } from 'lucide-react';

export const TopicSelectionPage = () => {
  const { topics, startTopicQuestion } = useLearning();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', 'Data Structures', 'Algorithms'];

  const filteredTopics = topics.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-indigo">Screen 6: Topic Catalogue</span>
            <span className="text-xs text-slate-400 font-mono">6 Core AI Subjects Available</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Topic Selection & Mastery Map</h1>
          <p className="text-sm text-slate-400 mt-1">
            Choose a subject area to launch adaptive question sequences or let AI select for you.
          </p>
        </div>

        {/* AI Quick Launch */}
        <button
          onClick={() => startTopicQuestion('recursion')}
          className="btn-primary py-3 px-6 shadow-lg shadow-indigo-600/30 self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4 text-cyan-300" /> Auto-Select Weakest Topic
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search topics or concepts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTopics.map(topic => (
          <div 
            key={topic.id} 
            className="glass-panel p-6 space-y-4 flex flex-col justify-between hover:border-indigo-500/50 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-indigo-400 font-semibold">{topic.category}</span>
                <span className={
                  topic.difficulty === 'Beginner' ? 'badge-emerald' : 
                  topic.difficulty === 'Intermediate' ? 'badge-indigo' : 'badge-amber'
                }>
                  {topic.difficulty}
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mt-2">{topic.title}</h2>
              
              {topic.recommended && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI High-Priority Topic
                </div>
              )}

              {/* Progress & Forgetting */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Mastery Rating</span>
                  <span className="font-bold text-white">{topic.mastery}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${topic.mastery}%`,
                      backgroundColor: topic.color || '#6366F1'
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Questions: {topic.completedQuestions}/{topic.totalQuestions}</span>
                  <span className="text-rose-400 font-mono">Risk: {topic.forgettingRisk}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startTopicQuestion(topic.id)}
              className="btn-primary w-full justify-center py-2.5 mt-4 text-xs"
            >
              <Play className="w-3.5 h-3.5 fill-white" /> Start Practice Drill
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
