import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, ExamType, StudyPlan, PracticeSession, DiagnosticResult, Notification, Recommendation, ChatMessage, SubjectBreakdown } from '@/types';
import { 
  MOCK_USER, 
  MOCK_STUDY_PLAN, 
  MOCK_NOTIFICATIONS, 
  MOCK_RECOMMENDATIONS,
  getRandomQuestions, 
  calculatePredictedScore,
  getDaysUntilExam,
  EXAM_CONFIGS,
} from '@/data/mockData';

type ThemeMode = 'dark' | 'light' | 'system';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  themeMode: ThemeMode;
  currentExam: ExamType;
  studyPlan: StudyPlan | null;
  currentSession: PracticeSession | null;
  diagnosticResult: DiagnosticResult | null;
  predictedScore: number;
  streak: number;
  notifications: Notification[];
  recommendations: Recommendation[];
  chatMessages: ChatMessage[];
  daysUntilExam: number;
  examConfig: typeof EXAM_CONFIGS[ExamType];
  login: (email: string, _password: string) => Promise<boolean>;
  signup: (name: string, email: string, _password: string, examType: ExamType, subjects: string[]) => Promise<boolean>;
  logout: () => void;
  setCurrentExam: (exam: ExamType) => void;
  toggleDarkMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  startPracticeSession: (subjectId?: string, topicId?: string) => void;
  submitPracticeAnswer: (questionIndex: number, answer: number) => void;
  completePracticeSession: () => void;
  startDiagnostic: () => void;
  submitDiagnosticAnswer: (questionIndex: number, answer: number) => void;
  completeDiagnostic: () => void;
  updateStreak: () => void;
  completeTask: (taskId: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  sendChatMessage: (content: string) => void;
  updateExamDate: (date: Date) => void;
  updateTargetScore: (score: number) => void;
  updateSubjects: (subjects: string[]) => void;
  updateDailyStudyTime: (time: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentExam, setCurrentExam] = useState<ExamType>('JAMB');
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [currentSession, setCurrentSession] = useState<PracticeSession | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [predictedScore, setPredictedScore] = useState(210);
  const [streak, setStreak] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [recommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI tutor. Ask me anything about your studies!',
      timestamp: new Date(),
    },
  ]);

  const examConfig = EXAM_CONFIGS[currentExam];
  const daysUntilExam = getDaysUntilExam(user?.examDate);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('kwado-theme') as ThemeMode;
    if (savedTheme) {
      setThemeModeState(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  // Apply theme based on mode
  const applyTheme = (mode: ThemeMode) => {
    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      setIsDarkMode(mode === 'dark');
      if (mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('kwado-theme', mode);
    applyTheme(mode);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    if (email) {
      setUser(MOCK_USER);
      setIsAuthenticated(true);
      setStudyPlan(MOCK_STUDY_PLAN);
      setStreak(MOCK_USER.streak);
      setCurrentExam(MOCK_USER.examType);
      setPredictedScore(calculatePredictedScore(MOCK_USER.examType));
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (
    name: string, 
    email: string, 
    _password: string, 
    examType: ExamType, 
    subjects: string[]
  ): Promise<boolean> => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      examType,
      subjects,
      examDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // Default 90 days
      dailyStudyTime: 2,
      streak: 0,
      createdAt: new Date(),
    };
    setUser(newUser);
    setIsAuthenticated(true);
    setCurrentExam(examType);
    setStreak(0);
    setPredictedScore(calculatePredictedScore(examType));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setStudyPlan(null);
    setCurrentSession(null);
    setDiagnosticResult(null);
    setStreak(0);
    setChatMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I\'m your AI tutor. Ask me anything about your studies!',
        timestamp: new Date(),
      },
    ]);
  }, []);

  const handleSetCurrentExam = useCallback((exam: ExamType) => {
    setCurrentExam(exam);
    if (user) {
      setUser({ ...user, examType: exam });
    }
    setPredictedScore(calculatePredictedScore(exam));
  }, [user]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const startPracticeSession = useCallback((subjectId?: string, topicId?: string) => {
    const questions = getRandomQuestions(5);
    const session: PracticeSession = {
      id: `session-${Date.now()}`,
      userId: user?.id || 'guest',
      subjectId,
      topicId,
      questions,
      answers: new Array(questions.length).fill(-1),
      score: 0,
      timeSpent: 0,
      completedAt: new Date(),
    };
    setCurrentSession(session);
  }, [user]);

  const submitPracticeAnswer = useCallback((questionIndex: number, answer: number) => {
    if (currentSession) {
      const newAnswers = [...currentSession.answers];
      newAnswers[questionIndex] = answer;
      setCurrentSession({ ...currentSession, answers: newAnswers });
    }
  }, [currentSession]);

  const completePracticeSession = useCallback(() => {
    if (currentSession) {
      let correct = 0;
      currentSession.questions.forEach((q, i) => {
        if (currentSession.answers[i] === q.correctAnswer) correct++;
      });
      const score = Math.round((correct / currentSession.questions.length) * 100);
      setCurrentSession({ ...currentSession, score, completedAt: new Date() });
    }
  }, [currentSession]);

  const startDiagnostic = useCallback(() => {
    const questions = getRandomQuestions(10);
    const session: PracticeSession = {
      id: `diagnostic-${Date.now()}`,
      userId: user?.id || 'guest',
      questions,
      answers: new Array(questions.length).fill(-1),
      score: 0,
      timeSpent: 0,
      completedAt: new Date(),
    };
    setCurrentSession(session);
  }, [user]);

  const submitDiagnosticAnswer = useCallback((questionIndex: number, answer: number) => {
    if (currentSession) {
      const newAnswers = [...currentSession.answers];
      newAnswers[questionIndex] = answer;
      setCurrentSession({ ...currentSession, answers: newAnswers });
    }
  }, [currentSession]);

  const completeDiagnostic = useCallback(() => {
    if (currentSession && user) {
      let correct = 0;
      const subjectBreakdown: Record<string, { correct: number; total: number }> = {};
      
      currentSession.questions.forEach((q, i) => {
        const isCorrect = currentSession.answers[i] === q.correctAnswer;
        if (isCorrect) correct++;
        
        if (!subjectBreakdown[q.subjectId]) {
          subjectBreakdown[q.subjectId] = { correct: 0, total: 0 };
        }
        subjectBreakdown[q.subjectId].total++;
        if (isCorrect) subjectBreakdown[q.subjectId].correct++;
      });

      const score = Math.round((correct / currentSession.questions.length) * 100);
      const predicted = calculatePredictedScore(user.examType);
      
      const breakdown: SubjectBreakdown[] = Object.entries(subjectBreakdown).map(([subjectId, data]) => ({
        subjectId,
        subjectName: subjectId === 'math-1' ? 'Mathematics' : subjectId === 'eng-1' ? 'English' : 'Physics',
        correct: data.correct,
        total: data.total,
        percentage: Math.round((data.correct / data.total) * 100),
      }));
      
      const result: DiagnosticResult = {
        id: `result-${Date.now()}`,
        userId: user.id,
        subjectId: 'general',
        score,
        totalQuestions: currentSession.questions.length,
        subjectBreakdown: breakdown,
        strengths: score > 70 ? ['Strong foundational knowledge'] : [],
        weaknesses: score < 60 ? ['Needs improvement in core concepts'] : [],
        predictedScore: predicted,
        targetGap: (user.targetScore || 250) - predicted,
        takenAt: new Date(),
      };
      
      setDiagnosticResult(result);
      setPredictedScore(predicted);
      setCurrentSession(null);
    }
  }, [currentSession, user]);

  const updateStreak = useCallback(() => {
    setStreak(prev => prev + 1);
    if (user) {
      setUser({ ...user, streak: (user.streak || 0) + 1, lastStudyDate: new Date() });
    }
  }, [user]);

  const completeTask = useCallback((taskId: string) => {
    if (studyPlan) {
      const updatedTasks = studyPlan.tasks.map(task =>
        task.id === taskId ? { ...task, completed: true } : task
      );
      setStudyPlan({ ...studyPlan, tasks: updatedTasks });
    }
  }, [studyPlan]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const sendChatMessage = useCallback((content: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    
    // Mock AI response
    setTimeout(() => {
      const responses = [
        'That\'s a great question! Let me help you understand this concept better.',
        'Based on your study plan, I recommend focusing on this topic for the next 30 minutes.',
        'You\'re making good progress! Keep practicing these types of questions.',
        'Here\'s a helpful tip: Break down complex problems into smaller steps.',
        'Would you like me to explain this with an example?',
      ];
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  }, []);

  const updateExamDate = useCallback((date: Date) => {
    if (user) {
      setUser({ ...user, examDate: date });
    }
  }, [user]);

  const updateTargetScore = useCallback((score: number) => {
    if (user) {
      setUser({ ...user, targetScore: score });
    }
  }, [user]);

  const updateSubjects = useCallback((subjects: string[]) => {
    if (user) {
      setUser({ ...user, subjects });
    }
  }, [user]);

  const updateDailyStudyTime = useCallback((time: number) => {
    if (user) {
      setUser({ ...user, dailyStudyTime: time });
    }
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        isDarkMode,
        themeMode,
        currentExam,
        studyPlan,
        currentSession,
        diagnosticResult,
        predictedScore,
        streak,
        notifications,
        recommendations,
        chatMessages,
        daysUntilExam,
        examConfig,
        login,
        signup,
        logout,
        setCurrentExam: handleSetCurrentExam,
        toggleDarkMode,
        setThemeMode,
        startPracticeSession,
        submitPracticeAnswer,
        completePracticeSession,
        startDiagnostic,
        submitDiagnosticAnswer,
        completeDiagnostic,
        updateStreak,
        completeTask,
        markNotificationRead,
        clearAllNotifications,
        sendChatMessage,
        updateExamDate,
        updateTargetScore,
        updateSubjects,
        updateDailyStudyTime,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
