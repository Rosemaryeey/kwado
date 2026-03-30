import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, AlertCircle, ChevronRight, Target, BookOpen } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const { recommendations } = useApp();

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
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Target className="w-4 h-4 text-yellow-500" />;
      default:
        return <BookOpen className="w-4 h-4 text-kwado-green" />;
    }
  };

  return (
    <div className="kwado-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
          <Lightbulb className="w-5 h-5 text-kwado-green" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-kwado-text">Recommendations</h2>
          <p className="text-sm text-kwado-text-muted">Personalized for you</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.slice(0, 3).map((rec) => (
          <button
            key={rec.id}
            onClick={() => navigate(rec.action)}
            className={`w-full p-4 rounded-xl border text-left transition-all duration-200 hover:scale-[1.02] ${getPriorityColor(rec.priority)}`}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-kwado-bg flex items-center justify-center flex-shrink-0">
                {getPriorityIcon(rec.priority)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-kwado-text text-sm">{rec.title}</p>
                <p className="text-xs text-kwado-text-muted mt-1 line-clamp-2">
                  {rec.description}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-kwado-text-secondary flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate('/recommendations')}
        className="w-full mt-4 py-3 text-sm text-kwado-green hover:underline"
      >
        View all recommendations
      </button>
    </div>
  );
};

export default Recommendations;
