import React, { useState } from 'react';
import { TrendingUp, Award, Clock, Target, Flame } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, CartesianGrid } from 'recharts';
import { MOCK_PROGRESS_DATA, MOCK_SUBJECTS } from '@/data/mockData';

const Progress: React.FC = () => {
  const { predictedScore, streak } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChart, setActiveChart] = useState<'accuracy' | 'questions' | 'time'>('accuracy');

  // Generate streak calendar data
  const generateStreakData = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        active: Math.random() > 0.3, // Mock data
        day: date.getDate(),
      });
    }
    return days;
  };

  const streakData = generateStreakData();

  const stats = [
    { label: 'Total Questions', value: '1,247', icon: Target, color: 'text-kwado-green' },
    { label: 'Study Hours', value: '48.5', icon: Clock, color: 'text-blue-500' },
    { label: 'Avg Accuracy', value: '72%', icon: TrendingUp, color: 'text-purple-500' },
    { label: 'Current Streak', value: `${streak} days`, icon: Flame, color: 'text-yellow-500' },
  ];

  const chartData = {
    accuracy: MOCK_PROGRESS_DATA,
    questions: MOCK_PROGRESS_DATA.map(d => ({ ...d, value: d.questionsAttempted })),
    time: MOCK_PROGRESS_DATA.map(d => ({ ...d, value: d.studyTime })),
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
                <TrendingUp className="w-5 h-5 text-kwado-green" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-kwado-text">Progress</h1>
                <p className="text-sm text-kwado-text-muted">Track your learning journey</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="kwado-card p-5">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-kwado-bg flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-kwado-text">{stat.value}</p>
                    <p className="text-sm text-kwado-text-muted">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Chart */}
              <div className="kwado-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-display font-bold text-kwado-text">Performance Trend</h2>
                  <div className="flex items-center gap-2">
                    {(['accuracy', 'questions', 'time'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveChart(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all duration-200 ${
                          activeChart === type
                            ? 'bg-kwado-green text-white'
                            : 'bg-kwado-border text-kwado-text-muted hover:text-kwado-text'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData[activeChart]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1F2A26" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        stroke="#5A7368"
                        fontSize={12}
                      />
                      <YAxis stroke="#5A7368" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111917', 
                          border: '1px solid #1F2A26',
                          borderRadius: '12px'
                        }}
                        labelStyle={{ color: '#EAFBF3' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey={activeChart === 'accuracy' ? 'accuracy' : 'value'}
                        stroke="#22C55E" 
                        strokeWidth={3}
                        dot={{ fill: '#22C55E', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#22C55E', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Subject Progress */}
              <div className="kwado-card p-6">
                <h2 className="text-lg font-display font-bold text-kwado-text mb-6">Subject Progress</h2>
                <div className="space-y-4">
                  {MOCK_SUBJECTS.map((subject) => {
                    const avgProficiency = Math.round(
                      subject.topics.reduce((acc, t) => acc + (t.correctAnswers / t.questionsAttempted) * 100, 0) / subject.topics.length
                    ) || 0;
                    
                    return (
                      <div key={subject.id} className="flex items-center gap-4">
                        <span className="w-32 text-sm text-kwado-text">{subject.name}</span>
                        <div className="flex-1">
                          <div className="kwado-progress">
                            <div 
                              className="kwado-progress-bar" 
                              style={{ 
                                width: `${avgProficiency}%`,
                                backgroundColor: avgProficiency >= 70 ? '#22C55E' : avgProficiency >= 50 ? '#EAB308' : '#EF4444'
                              }} 
                            />
                          </div>
                        </div>
                        <span className="w-12 text-sm font-medium text-kwado-text text-right">{avgProficiency}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Streak Calendar */}
              <div className="kwado-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-lg font-display font-bold text-kwado-text">Streak Calendar</h2>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {streakData.map((day, index) => (
                    <div
                      key={index}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                        day.active
                          ? 'bg-kwado-green text-white'
                          : 'bg-kwado-border text-kwado-text-muted'
                      }`}
                      title={day.date}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-kwado-border">
                  <span className="text-sm text-kwado-text-muted">Current Streak</span>
                  <span className="text-lg font-display font-bold text-yellow-500">{streak} days</span>
                </div>
              </div>

              {/* Predicted Score */}
              <div className="kwado-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-kwado-green" />
                  <h2 className="text-lg font-display font-bold text-kwado-text">Predicted Score</h2>
                </div>
                <div className="text-center py-4">
                  <span className="text-5xl font-display font-bold text-kwado-green">{predictedScore}</span>
                  <span className="text-kwado-text-muted text-lg">/400</span>
                </div>
                <div className="kwado-progress mb-2">
                  <div 
                    className="kwado-progress-bar" 
                    style={{ width: `${(predictedScore / 400) * 100}%` }} 
                  />
                </div>
                <p className="text-sm text-kwado-text-muted text-center">
                  Based on your practice performance
                </p>
              </div>

              {/* Daily Activity */}
              <div className="kwado-card p-6">
                <h2 className="text-lg font-display font-bold text-kwado-text mb-4">Daily Activity</h2>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MOCK_PROGRESS_DATA.slice(-7)}>
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'narrow' })}
                        stroke="#5A7368"
                        fontSize={10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111917', 
                          border: '1px solid #1F2A26',
                          borderRadius: '12px'
                        }}
                      />
                      <Bar dataKey="questionsAttempted" fill="#22C55E" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Progress;
