import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Bell, 
  Moon, 
  LogOut, 
  BookOpen, 
  Sun, 
  Monitor,
  Target,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { EXAM_SUBJECTS, EXAM_CONFIGS } from '@/data/mockData';
import Sidebar from '@/components/Sidebar';
import type { ExamType } from '@/types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { 
    user, 
    logout, 
    setCurrentExam, 
    themeMode, 
    setThemeMode, 
    updateExamDate, 
    updateTargetScore,
    updateSubjects
  } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'exam' | 'notifications'>('general');

  const [notifications, setNotifications] = useState({
    studyReminders: true,
    streakAlerts: true,
    progressUpdates: false,
    newFeatures: true,
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExamChange = (exam: ExamType) => {
    setCurrentExam(exam);
  };

  const handleSubjectToggle = (subject: string) => {
    if (user) {
      const newSubjects = user.subjects.includes(subject)
        ? user.subjects.filter(s => s !== subject)
        : [...user.subjects, subject];
      updateSubjects(newSubjects);
    }
  };

  const availableSubjects = user?.examType ? EXAM_SUBJECTS[user.examType] || [] : [];
  const examConfig = user?.examType ? EXAM_CONFIGS[user.examType] : null;

  return (
    <div className="min-h-screen bg-kwado-bg flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-kwado-bg/80 backdrop-blur-md border-b border-kwado-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-kwado-green" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-kwado-text">Settings</h1>
                <p className="text-sm text-kwado-text-muted">Manage your preferences</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <div className="grid lg:grid-cols-4 gap-6 max-w-5xl">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="kwado-card p-2 space-y-1 sticky top-24">
                <button
                  onClick={() => setActiveSection('general')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === 'general'
                      ? 'bg-kwado-green/10 text-kwado-green'
                      : 'text-kwado-text-muted hover:bg-kwado-border hover:text-kwado-text'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">General</span>
                </button>
                <button
                  onClick={() => setActiveSection('exam')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === 'exam'
                      ? 'bg-kwado-green/10 text-kwado-green'
                      : 'text-kwado-text-muted hover:bg-kwado-border hover:text-kwado-text'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span className="font-medium">Exam Settings</span>
                </button>
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSection === 'notifications'
                      ? 'bg-kwado-green/10 text-kwado-green'
                      : 'text-kwado-text-muted hover:bg-kwado-border hover:text-kwado-text'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="font-medium">Notifications</span>
                </button>
                <div className="border-t border-kwado-border my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* General Settings */}
              {activeSection === 'general' && (
                <div className="space-y-6">
                  {/* Profile Card */}
                  <div className="kwado-card p-6">
                    <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-kwado-green" />
                      Profile
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-kwado-green/20 flex items-center justify-center">
                        <span className="text-2xl font-display font-bold text-kwado-green">
                          {user?.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-kwado-text">{user?.name}</p>
                        <p className="text-sm text-kwado-text-muted">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Theme Settings */}
                  <div className="kwado-card p-6">
                    <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                      <Moon className="w-5 h-5 text-kwado-green" />
                      Appearance
                    </h2>
                    <div className="space-y-3">
                      <p className="text-sm text-kwado-text-muted mb-3">Choose your preferred theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setThemeMode('light')}
                          className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                            themeMode === 'light'
                              ? 'border-kwado-green bg-kwado-green/10'
                              : 'border-kwado-border hover:border-kwado-green/50'
                          }`}
                        >
                          <Sun className="w-6 h-6 mx-auto mb-2 text-kwado-text" />
                          <span className="text-sm text-kwado-text">Light</span>
                        </button>
                        <button
                          onClick={() => setThemeMode('dark')}
                          className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                            themeMode === 'dark'
                              ? 'border-kwado-green bg-kwado-green/10'
                              : 'border-kwado-border hover:border-kwado-green/50'
                          }`}
                        >
                          <Moon className="w-6 h-6 mx-auto mb-2 text-kwado-text" />
                          <span className="text-sm text-kwado-text">Dark</span>
                        </button>
                        <button
                          onClick={() => setThemeMode('system')}
                          className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                            themeMode === 'system'
                              ? 'border-kwado-green bg-kwado-green/10'
                              : 'border-kwado-border hover:border-kwado-green/50'
                          }`}
                        >
                          <Monitor className="w-6 h-6 mx-auto mb-2 text-kwado-text" />
                          <span className="text-sm text-kwado-text">System</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Exam Settings */}
              {activeSection === 'exam' && (
                <div className="space-y-6">
                  {/* Exam Type */}
                  <div className="kwado-card p-6">
                    <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-kwado-green" />
                      Exam Type
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.keys(EXAM_CONFIGS).map((exam) => (
                        <button
                          key={exam}
                          onClick={() => handleExamChange(exam as ExamType)}
                          className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                            user?.examType === exam
                              ? 'border-kwado-green bg-kwado-green/10'
                              : 'border-kwado-border hover:border-kwado-green/50'
                          }`}
                        >
                          <span className="text-sm font-medium text-kwado-text">{exam}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exam Date */}
                  <div className="kwado-card p-6">
                    <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-kwado-green" />
                      Exam Date
                    </h2>
                    <input
                      type="date"
                      value={user?.examDate ? new Date(user.examDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateExamDate(new Date(e.target.value))}
                      className="kwado-input max-w-xs"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* Target Score */}
                  <div className="kwado-card p-6">
                    <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-kwado-green" />
                      Target Score
                    </h2>
                    {examConfig && (
                      <div className="space-y-4">
                        <div className="text-center">
                          <span className="text-4xl font-display font-bold text-kwado-green">
                            {user?.targetScore || 250}
                          </span>
                          <span className="text-kwado-text-muted text-lg">/{examConfig.maxScore}</span>
                        </div>
                        <input
                          type="range"
                          min={examConfig.minScore}
                          max={examConfig.maxScore}
                          value={user?.targetScore || 250}
                          onChange={(e) => updateTargetScore(parseInt(e.target.value))}
                          className="w-full h-2 bg-kwado-border rounded-lg appearance-none cursor-pointer accent-kwado-green"
                        />
                        <div className="flex justify-between text-sm text-kwado-text-muted">
                          <span>{examConfig.minScore}</span>
                          <span>{examConfig.maxScore}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subjects */}
                  <div className="kwado-card p-6">
                    <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-kwado-green" />
                      Subjects
                    </h2>
                    <p className="text-sm text-kwado-text-muted mb-4">
                      Selected: {user?.subjects.length || 0} of {examConfig?.maxSubjects || 4} max
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availableSubjects.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => handleSubjectToggle(subject)}
                          disabled={!user?.subjects.includes(subject) && (user?.subjects.length || 0) >= (examConfig?.maxSubjects || 4)}
                          className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${
                            user?.subjects.includes(subject)
                              ? 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                              : (user?.subjects.length || 0) >= (examConfig?.maxSubjects || 4)
                              ? 'border-kwado-border opacity-50 cursor-not-allowed'
                              : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeSection === 'notifications' && (
                <div className="kwado-card p-6">
                  <h2 className="text-lg font-display font-bold text-kwado-text mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-kwado-green" />
                    Notification Preferences
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                      <div>
                        <p className="font-medium text-kwado-text">Study Reminders</p>
                        <p className="text-sm text-kwado-text-muted">Daily reminders to study</p>
                      </div>
                      <Switch
                        checked={notifications.studyReminders}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, studyReminders: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                      <div>
                        <p className="font-medium text-kwado-text">Streak Alerts</p>
                        <p className="text-sm text-kwado-text-muted">Warn when streak is about to break</p>
                      </div>
                      <Switch
                        checked={notifications.streakAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, streakAlerts: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                      <div>
                        <p className="font-medium text-kwado-text">Progress Updates</p>
                        <p className="text-sm text-kwado-text-muted">Weekly progress summary</p>
                      </div>
                      <Switch
                        checked={notifications.progressUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, progressUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-kwado-bg border border-kwado-border">
                      <div>
                        <p className="font-medium text-kwado-text">New Features</p>
                        <p className="text-sm text-kwado-text-muted">Updates about new features</p>
                      </div>
                      <Switch
                        checked={notifications.newFeatures}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, newFeatures: checked })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
