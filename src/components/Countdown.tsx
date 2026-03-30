import React from 'react';
import { Calendar } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const Countdown: React.FC = () => {
  const { daysUntilExam, user } = useApp();

  if (!user?.examDate) return null;

  const getMessage = () => {
    if (daysUntilExam > 30) {
      return { text: 'You have plenty of time. Stay consistent!', color: 'countdown-safe' };
    } else if (daysUntilExam > 14) {
      return { text: 'Time is ticking. Keep up the momentum!', color: 'countdown-warning' };
    } else if (daysUntilExam > 7) {
      return { text: 'Final stretch! Focus on weak areas.', color: 'countdown-urgent' };
    } else if (daysUntilExam > 0) {
      return { text: 'Exam is very close! Review and rest well.', color: 'countdown-urgent' };
    } else {
      return { text: 'Exam day! You\'ve got this!', color: 'countdown-safe' };
    }
  };

  const { text, color } = getMessage();

  return (
    <div className="kwado-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
          <Calendar className="w-5 h-5 text-kwado-green" />
        </div>
        <div>
          <p className="text-sm text-kwado-text-muted">Days Until Exam</p>
          <p className={`text-3xl font-display font-bold ${color}`}>
            {daysUntilExam > 0 ? daysUntilExam : 0}
          </p>
        </div>
      </div>
      <p className="text-sm text-kwado-text-muted">{text}</p>
      {user.examDate && (
        <p className="text-xs text-kwado-text-secondary mt-2">
          Exam Date: {new Date(user.examDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}
    </div>
  );
};

export default Countdown;
