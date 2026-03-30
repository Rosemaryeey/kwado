import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, AlertCircle, Target, BookOpen, ChevronRight, Clock, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar';

const RecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { recommendations, daysUntilExam, streak } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredRecommendations = filter === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.priority === filter);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-500/30 bg-red-500/5';
      case 'medium':
        return 'border-yellow-500/30 bg-yellow-500/5';
      default:
        return 'border-kwado-green/30 bg-kwado-green/5';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <Target className="w-5 h-5 text-yellow-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-kwado-green" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Medium Priority';
      default:
        return 'Suggestion';
    }
  };

  return (
    <div className="min-h-screen bg-kwado-bg flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-kwado-bg/80 backdrop-blur-md border-b border-kwado-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-kwado-green" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-kwado-text">Recommendations</h1>
                <p className="text-sm text-kwado-text-muted">Personalized study suggestions</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="kwado-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-kwado-green" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-kwado-text">{recommendations.length}</p>
                  <p className="text-sm text-kwado-text-muted">Recommendations</p>
                </div>
              </div>
            </div>
            <div className="kwado-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-kwado-text">{daysUntilExam}</p>
                  <p className="text-sm text-kwado-text-muted">Days Left</p>
                </div>
              </div>
            </div>
            <div className="kwado-card p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-kwado-text">{streak}</p>
                  <p className="text-sm text-kwado-text-muted">Day Streak</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-kwado-text-muted">Filter by:</span>
            {(['all', 'high', 'medium', 'low'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl border text-sm capitalize transition-all duration-200 ${
                  filter === f
                    ? 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                    : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className={`kwado-card p-6 ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-kwado-bg flex items-center justify-center flex-shrink-0">
                        {getPriorityIcon(rec.priority)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            rec.priority === 'high' ? 'bg-red-500/20 text-red-500' :
                            rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-kwado-green/20 text-kwado-green'
                          }`}>
                            {getPriorityLabel(rec.priority)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-kwado-text text-lg">{rec.title}</h3>
                        <p className="text-kwado-text-muted mt-1">{rec.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => navigate(rec.action)}
                      className="kwado-btn-primary flex-shrink-0"
                    >
                      Start
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="kwado-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-kwado-green/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-kwado-green" />
                </div>
                <h3 className="text-xl font-display font-bold text-kwado-text mb-2">
                  All caught up!
                </h3>
                <p className="text-kwado-text-muted">
                  You have no pending recommendations. Keep up the good work!
                </p>
              </div>
            )}
          </div>

          {/* Study Tips Section */}
          <div className="mt-8 kwado-card p-6">
            <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-kwado-green" />
              Study Tips Based on Your Progress
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-kwado-text mb-1">Spaced Repetition</h4>
                    <p className="text-sm text-kwado-text-muted">
                      Review topics at increasing intervals to improve long-term retention.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-kwado-text mb-1">Focus on Weak Areas</h4>
                    <p className="text-sm text-kwado-text-muted">
                      Spend more time on topics where your accuracy is below 70%.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-kwado-text mb-1">Timed Practice</h4>
                    <p className="text-sm text-kwado-text-muted">
                      Use the CBT simulator to practice under exam conditions.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-kwado-text mb-1">Daily Consistency</h4>
                    <p className="text-sm text-kwado-text-muted">
                      Study a little every day rather than cramming. Build that streak!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecommendationsPage;
