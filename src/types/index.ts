export type ExamType = 'WAEC' | 'NECO' | 'JAMB' | 'ICAN' | 'SAT' | 'POST_UTME' | 'UNIVERSITY';

export interface ExamConfig {
  maxSubjects: number;
  scoreSystem: 'jamb' | 'waec' | 'ican' | 'sat';
  maxScore: number;
  minScore: number;
  gradingSystem?: Record<string, string>;
  timeLimit?: number;
}

export interface Subject {
  id: string;
  name: string;
  examType: ExamType;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  proficiency: 'weak' | 'average' | 'strong';
  questionsAttempted: number;
  correctAnswers: number;
}

export interface Question {
  id: string;
  subjectId: string;
  topicId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface User {
  id: string;
  name: string;
  email: string;
  examType: ExamType;
  subjects: string[];
  examDate?: Date;
  targetScore?: number;
  dailyStudyTime: number;
  streak: number;
  lastStudyDate?: Date;
  createdAt: Date;
}

export interface StudyPlan {
  id: string;
  userId: string;
  date: Date;
  tasks: StudyTask[];
  completed: boolean;
}

export interface StudyTask {
  id: string;
  subjectId: string;
  topicId: string;
  type: 'learn' | 'practice' | 'review';
  title: string;
  description: string;
  estimatedTime: number;
  completed: boolean;
}

export interface DiagnosticResult {
  id: string;
  userId: string;
  subjectId: string;
  score: number;
  totalQuestions: number;
  subjectBreakdown: SubjectBreakdown[];
  strengths: string[];
  weaknesses: string[];
  predictedScore: number;
  targetGap: number;
  takenAt: Date;
}

export interface SubjectBreakdown {
  subjectId: string;
  subjectName: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface PracticeSession {
  id: string;
  userId: string;
  subjectId?: string;
  topicId?: string;
  questions: Question[];
  answers: number[];
  score: number;
  timeSpent: number;
  completedAt: Date;
}

export interface CBTExam {
  id: string;
  userId: string;
  examType: ExamType;
  subjects: string[];
  questions: Question[];
  answers: number[];
  score: number;
  timeLimit: number;
  timeSpent: number;
  completedAt?: Date;
}

export interface ProgressData {
  date: string;
  accuracy: number;
  questionsAttempted: number;
  studyTime: number;
}

export interface WeaknessMapItem {
  subjectId: string;
  subjectName: string;
  topics: {
    topicId: string;
    topicName: string;
    proficiency: 'weak' | 'average' | 'strong';
    percentage: number;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  createdAt: Date;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
