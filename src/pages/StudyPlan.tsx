import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle, BookOpen, Target, ChevronRight, Flame, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar';

const StudyPlan: React.FC = () => {
  const navigate = useNavigate();
  const { studyPlan, completeTask, predictedScore, streak } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'month'>('today');

  const pendingTasks = studyPlan?.tasks.filter(t => !t.completed) || [];
  const completedTasks = studyPlan?.tasks.filter(t => t.completed) || [];
  const progressPercentage = studyPlan?.tasks.length 
    ? Math.round((completedTasks.length / studyPlan.tasks.length) * 100) 
    : 0;

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'practice':
        return <BookOpen className="w-5 h-5 text-kwado-green" />;
      case 'learn':
        return <Target className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
    }
  };

  const getTaskBg = (type: string) => {
    switch (type) {
      case 'practice':
        return 'bg-kwado-green/10';
      case 'learn':
        return 'bg-blue-500/10';
      default:
        return 'bg-purple-500/10';
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
                <Calendar className="w-5 h-5 text-kwado-green" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-kwado-text">Study Plan</h1>
                <p className="text-sm text-kwado-text-muted">Your personalized learning schedule</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Overview */}
              <div className="kwado-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-display font-bold text-kwado-text">Today's Progress</h2>
                    <p className="text-sm text-kwado-text-muted">
                      {completedTasks.length} of {studyPlan?.tasks.length || 0} tasks completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-kwado-green">{progressPercentage}%</p>
                  </div>
                </div>
                <div className="kwado-progress mb-4">
                  <div 
                    className="kwado-progress-bar" 
                    style={{ width: `${progressPercentage}%` }} 
                  />
                </div>
                <p className="text-sm text-kwado-text-muted">
                  {progressPercentage === 100 
                    ? 'Great job! All tasks completed for today.' 
                    : `You're ${100 - progressPercentage}% away from completing today's plan.`}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-kwado-border">
                {(['today', 'week', 'month'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium capitalize transition-colors relative ${
                      activeTab === tab 
                        ? 'text-kwado-green' 
                        : 'text-kwado-text-muted hover:text-kwado-text'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-kwado-green" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                <h3 className="text-lg font-display font-bold text-kwado-text">Pending Tasks</h3>
                {pendingTasks.length > 0 ? (
                  pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="kwado-card p-5 hover:border-kwado-green/30 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl ${getTaskBg(task.type)} flex items-center justify-center flex-shrink-0`}>
                            {getTaskIcon(task.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                                task.type === 'practice' ? 'bg-kwado-green/10 text-kwado-green' :
                                task.type === 'learn' ? 'bg-blue-500/10 text-blue-500' :
                                'bg-purple-500/10 text-purple-500'
                              }`}>
                                {task.type}
                              </span>
                            </div>
                            <h4 className="font-semibold text-kwado-text">{task.title}</h4>
                            <p className="text-sm text-kwado-text-muted">{task.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1 text-sm text-kwado-text-muted">
                                <Clock className="w-4 h-4" />
                                {task.estimatedTime} mins
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => completeTask(task.id)}
                          className="kwado-btn-primary"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="kwado-card p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-kwado-green/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-kwado-green" />
                    </div>
                    <p className="text-kwado-text font-medium">All tasks completed!</p>
                    <p className="text-sm text-kwado-text-muted">You're on track with your study plan.</p>
                  </div>
                )}
              </div>

              {/* Completed Tasks */}
              {completedTasks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-display font-bold text-kwado-text">Completed</h3>
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="kwado-card p-5 opacity-60"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-kwado-green/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-kwado-green" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-kwado-text line-through">{task.title}</h4>
                          <p className="text-sm text-kwado-text-muted">{task.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Motivation Card */}
              <div className="kwado-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                    <Flame className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-kwado-text-muted">You're</p>
                    <p className="text-2xl font-display font-bold text-kwado-text">{progressPercentage}% ready</p>
                  </div>
                </div>
                <div className="kwado-progress">
                  <div 
                    className="kwado-progress-bar" 
                    style={{ width: `${progressPercentage}%` }} 
                  />
                </div>
                <p className="text-sm text-kwado-text-muted mt-3">
                  Keep going! Consistency is key to success.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="kwado-card p-6">
                <h3 className="font-semibold text-kwado-text mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kwado-text-muted">Study Streak</span>
                    <span className="font-medium text-kwado-text">{streak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kwado-text-muted">Predicted Score</span>
                    <span className="font-medium text-kwado-green">{predictedScore}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-kwado-text-muted">Tasks Today</span>
                    <span className="font-medium text-kwado-text">{studyPlan?.tasks.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => navigate('/practice')}
                className="w-full kwado-btn-primary py-4"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Practice Session
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;
