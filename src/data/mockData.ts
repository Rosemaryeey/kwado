import type { ExamType, Subject, Question, User, StudyPlan, WeaknessMapItem, ProgressData, ExamConfig, Notification, Recommendation } from '@/types';

export const EXAM_CONFIGS: Record<ExamType, ExamConfig> = {
  JAMB: {
    maxSubjects: 4,
    scoreSystem: 'jamb',
    maxScore: 400,
    minScore: 0,
    timeLimit: 120,
  },
  WAEC: {
    maxSubjects: 9,
    scoreSystem: 'waec',
    maxScore: 100,
    minScore: 0,
    gradingSystem: {
      'A1': 'Excellent (90-100%)',
      'B2': 'Very Good (80-89%)',
      'B3': 'Good (70-79%)',
      'C4': 'Credit (60-69%)',
      'C5': 'Credit (55-59%)',
      'C6': 'Credit (50-54%)',
      'D7': 'Pass (45-49%)',
      'E8': 'Pass (40-44%)',
      'F9': 'Fail (0-39%)',
    },
  },
  NECO: {
    maxSubjects: 9,
    scoreSystem: 'waec',
    maxScore: 100,
    minScore: 0,
    gradingSystem: {
      'A1': 'Excellent (90-100%)',
      'B2': 'Very Good (80-89%)',
      'B3': 'Good (70-79%)',
      'C4': 'Credit (60-69%)',
      'C5': 'Credit (55-59%)',
      'C6': 'Credit (50-54%)',
      'D7': 'Pass (45-49%)',
      'E8': 'Pass (40-44%)',
      'F9': 'Fail (0-39%)',
    },
  },
  ICAN: {
    maxSubjects: 6,
    scoreSystem: 'ican',
    maxScore: 100,
    minScore: 0,
    gradingSystem: {
      'Pass': '50% and above',
      'Fail': 'Below 50%',
    },
  },
  SAT: {
    maxSubjects: 3,
    scoreSystem: 'sat',
    maxScore: 1600,
    minScore: 400,
    timeLimit: 180,
  },
  POST_UTME: {
    maxSubjects: 4,
    scoreSystem: 'jamb',
    maxScore: 400,
    minScore: 0,
    timeLimit: 60,
  },
  UNIVERSITY: {
    maxSubjects: 6,
    scoreSystem: 'ican',
    maxScore: 100,
    minScore: 0,
    gradingSystem: {
      'A': '70-100%',
      'B': '60-69%',
      'C': '50-59%',
      'D': '45-49%',
      'F': 'Below 45%',
    },
  },
};

export const EXAM_SUBJECTS: Record<ExamType, string[]> = {
  POST_UTME: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Government',
    'Economics',
    'Literature in English',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'History',
    'Geography',
    'Commerce',
    'Accounting',
  ],
  UNIVERSITY: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Economics',
    'Accounting',
    'Business Administration',
    'Political Science',
    'Sociology',
    'Psychology',
    'Law',
    'Medicine',
    'Engineering',
  ],
  WAEC: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Government',
    'Economics',
    'Literature in English',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'History',
    'Geography',
    'Commerce',
    'Accounting',
    'Agricultural Science',
    'Further Mathematics',
    'Technical Drawing',
    'Food and Nutrition',
    'Home Economics',
    'Visual Arts',
  ],
  NECO: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Government',
    'Economics',
    'Literature in English',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'History',
    'Geography',
    'Commerce',
    'Accounting',
    'Agricultural Science',
    'Further Mathematics',
    'Technical Drawing',
    'Food and Nutrition',
    'Home Economics',
    'Visual Arts',
  ],
  JAMB: [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Government',
    'Economics',
    'Literature in English',
    'Christian Religious Studies',
    'Islamic Religious Studies',
    'History',
    'Geography',
    'Commerce',
    'Accounting',
    'Agricultural Science',
  ],
  ICAN: [
    'Financial Accounting',
    'Management Accounting',
    'Auditing and Assurance',
    'Taxation',
    'Business Law',
    'Corporate Reporting',
    'Strategic Business Management',
    'Performance Management',
  ],
  SAT: [
    'Mathematics (No Calculator)',
    'Mathematics (Calculator)',
    'Evidence-Based Reading',
    'Writing and Language',
    'Essay (Optional)',
  ],
};

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 'math-1',
    name: 'Mathematics',
    examType: 'JAMB',
    topics: [
      { id: 'alg-1', name: 'Algebra', proficiency: 'average', questionsAttempted: 20, correctAnswers: 12 },
      { id: 'geo-1', name: 'Geometry', proficiency: 'strong', questionsAttempted: 15, correctAnswers: 13 },
      { id: 'trig-1', name: 'Trigonometry', proficiency: 'weak', questionsAttempted: 10, correctAnswers: 4 },
      { id: 'calc-1', name: 'Calculus', proficiency: 'weak', questionsAttempted: 8, correctAnswers: 2 },
    ],
  },
  {
    id: 'eng-1',
    name: 'English Language',
    examType: 'JAMB',
    topics: [
      { id: 'comp-1', name: 'Comprehension', proficiency: 'strong', questionsAttempted: 25, correctAnswers: 21 },
      { id: 'gram-1', name: 'Grammar', proficiency: 'average', questionsAttempted: 18, correctAnswers: 11 },
      { id: 'voc-1', name: 'Vocabulary', proficiency: 'strong', questionsAttempted: 20, correctAnswers: 17 },
    ],
  },
  {
    id: 'phy-1',
    name: 'Physics',
    examType: 'JAMB',
    topics: [
      { id: 'mech-1', name: 'Mechanics', proficiency: 'weak', questionsAttempted: 12, correctAnswers: 5 },
      { id: 'elec-1', name: 'Electronics', proficiency: 'average', questionsAttempted: 15, correctAnswers: 9 },
      { id: 'opt-1', name: 'Optics', proficiency: 'average', questionsAttempted: 10, correctAnswers: 6 },
    ],
  },
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    subjectId: 'math-1',
    topicId: 'alg-1',
    question: 'Solve for x: 2x + 5 = 15',
    options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 20'],
    correctAnswer: 0,
    explanation: 'Subtract 5 from both sides: 2x = 10. Then divide by 2: x = 5.',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    subjectId: 'math-1',
    topicId: 'alg-1',
    question: 'If x² - 5x + 6 = 0, what are the values of x?',
    options: ['x = 2, 3', 'x = -2, -3', 'x = 1, 6', 'x = -1, -6'],
    correctAnswer: 0,
    explanation: 'Factor: (x - 2)(x - 3) = 0, so x = 2 or x = 3.',
    difficulty: 'medium',
  },
  {
    id: 'q3',
    subjectId: 'eng-1',
    topicId: 'gram-1',
    question: 'Choose the correct sentence:',
    options: [
      'She don\'t like apples.',
      'She doesn\'t likes apples.',
      'She doesn\'t like apples.',
      'She not like apples.',
    ],
    correctAnswer: 2,
    explanation: 'Correct form: "She doesn\'t like apples." Use base verb after "doesn\'t".',
    difficulty: 'easy',
  },
  {
    id: 'q4',
    subjectId: 'phy-1',
    topicId: 'mech-1',
    question: 'What is the SI unit of force?',
    options: ['Watt', 'Newton', 'Joule', 'Pascal'],
    correctAnswer: 1,
    explanation: 'The Newton (N) is the SI unit of force. 1 N = 1 kg·m/s².',
    difficulty: 'easy',
  },
  {
    id: 'q5',
    subjectId: 'math-1',
    topicId: 'trig-1',
    question: 'What is sin(30°)?',
    options: ['0', '0.5', '1', '√3/2'],
    correctAnswer: 1,
    explanation: 'sin(30°) = 0.5 or 1/2.',
    difficulty: 'easy',
  },
  {
    id: 'q6',
    subjectId: 'math-1',
    topicId: 'calc-1',
    question: 'What is the derivative of x²?',
    options: ['x', '2x', 'x²', '2'],
    correctAnswer: 1,
    explanation: 'Using the power rule: d/dx(x²) = 2x.',
    difficulty: 'medium',
  },
  {
    id: 'q7',
    subjectId: 'eng-1',
    topicId: 'comp-1',
    question: 'In the passage, what does the author imply about education?',
    options: [
      'It is unnecessary',
      'It transforms lives',
      'It is too expensive',
      'It should be optional',
    ],
    correctAnswer: 1,
    explanation: 'The passage emphasizes education as a transformative force.',
    difficulty: 'medium',
  },
  {
    id: 'q8',
    subjectId: 'phy-1',
    topicId: 'elec-1',
    question: 'Ohm\'s Law states that V = ?',
    options: ['I/R', 'I×R', 'R/I', 'I+R'],
    correctAnswer: 1,
    explanation: 'Ohm\'s Law: Voltage (V) = Current (I) × Resistance (R).',
    difficulty: 'easy',
  },
];

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Chidi Okonkwo',
  email: 'chidi@example.com',
  examType: 'JAMB',
  subjects: ['Mathematics', 'English Language', 'Physics', 'Chemistry'],
  examDate: new Date('2026-04-15'),
  targetScore: 280,
  dailyStudyTime: 2,
  streak: 12,
  lastStudyDate: new Date(),
  createdAt: new Date('2026-01-15'),
};

export const MOCK_STUDY_PLAN: StudyPlan = {
  id: 'plan-1',
  userId: 'user-1',
  date: new Date(),
  tasks: [
    {
      id: 'task-1',
      subjectId: 'math-1',
      topicId: 'alg-1',
      type: 'practice',
      title: 'Algebra Practice',
      description: 'Solve 10 algebraic equations',
      estimatedTime: 30,
      completed: false,
    },
    {
      id: 'task-2',
      subjectId: 'phy-1',
      topicId: 'mech-1',
      type: 'learn',
      title: 'Mechanics Fundamentals',
      description: 'Review Newton\'s Laws of Motion',
      estimatedTime: 45,
      completed: false,
    },
    {
      id: 'task-3',
      subjectId: 'eng-1',
      topicId: 'comp-1',
      type: 'review',
      title: 'Comprehension Review',
      description: 'Review yesterday\'s comprehension exercises',
      estimatedTime: 20,
      completed: true,
    },
  ],
  completed: false,
};

export const MOCK_WEAKNESS_MAP: WeaknessMapItem[] = [
  {
    subjectId: 'math-1',
    subjectName: 'Mathematics',
    topics: [
      { topicId: 'alg-1', topicName: 'Algebra', proficiency: 'average', percentage: 60 },
      { topicId: 'geo-1', topicName: 'Geometry', proficiency: 'strong', percentage: 87 },
      { topicId: 'trig-1', topicName: 'Trigonometry', proficiency: 'weak', percentage: 40 },
      { topicId: 'calc-1', topicName: 'Calculus', proficiency: 'weak', percentage: 25 },
    ],
  },
  {
    subjectId: 'eng-1',
    subjectName: 'English',
    topics: [
      { topicId: 'comp-1', topicName: 'Comprehension', proficiency: 'strong', percentage: 84 },
      { topicId: 'gram-1', topicName: 'Grammar', proficiency: 'average', percentage: 61 },
      { topicId: 'voc-1', topicName: 'Vocabulary', proficiency: 'strong', percentage: 85 },
    ],
  },
  {
    subjectId: 'phy-1',
    subjectName: 'Physics',
    topics: [
      { topicId: 'mech-1', topicName: 'Mechanics', proficiency: 'weak', percentage: 42 },
      { topicId: 'elec-1', topicName: 'Electronics', proficiency: 'average', percentage: 60 },
      { topicId: 'opt-1', topicName: 'Optics', proficiency: 'average', percentage: 60 },
    ],
  },
];

export const MOCK_PROGRESS_DATA: ProgressData[] = [
  { date: '2026-03-01', accuracy: 45, questionsAttempted: 20, studyTime: 45 },
  { date: '2026-03-05', accuracy: 52, questionsAttempted: 25, studyTime: 60 },
  { date: '2026-03-10', accuracy: 58, questionsAttempted: 30, studyTime: 75 },
  { date: '2026-03-15', accuracy: 65, questionsAttempted: 35, studyTime: 90 },
  { date: '2026-03-20', accuracy: 70, questionsAttempted: 40, studyTime: 105 },
  { date: '2026-03-25', accuracy: 75, questionsAttempted: 45, studyTime: 120 },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    title: 'Study Reminder',
    message: 'You haven\'t studied today. Keep your streak going!',
    type: 'warning',
    read: false,
    createdAt: new Date(),
  },
  {
    id: 'notif-2',
    title: 'Goal Alert',
    message: 'You\'re falling behind your study plan. 3 tasks pending.',
    type: 'warning',
    read: false,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'notif-3',
    title: 'Milestone Reached!',
    message: 'Congratulations! You\'ve completed 100 practice questions.',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'notif-4',
    title: 'Weak Topic Alert',
    message: 'Your Trigonometry score has dropped. Time to practice!',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 259200000),
  },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'Focus on Trigonometry',
    description: 'Your Trigonometry score is at 40%. Spend 30 minutes practicing today.',
    action: '/practice',
    priority: 'high',
  },
  {
    id: 'rec-2',
    title: 'Revise Weak Topics',
    description: 'You have 5 weak topics across Mathematics and Physics.',
    action: '/weakness-map',
    priority: 'high',
  },
  {
    id: 'rec-3',
    title: 'Take a CBT Simulation',
    description: 'You\'re ready for a full exam simulation. Test your progress!',
    action: '/cbt-simulator',
    priority: 'medium',
  },
];

export const getQuestionsBySubject = (subjectId?: string): Question[] => {
  if (!subjectId) return MOCK_QUESTIONS;
  return MOCK_QUESTIONS.filter(q => q.subjectId === subjectId);
};

export const getQuestionsByTopic = (topicId: string): Question[] => {
  return MOCK_QUESTIONS.filter(q => q.topicId === topicId);
};

export const getRandomQuestions = (count: number): Question[] => {
  const shuffled = [...MOCK_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const calculatePredictedScore = (examType: ExamType): number => {
  const config = EXAM_CONFIGS[examType];
  const weaknesses = MOCK_WEAKNESS_MAP;
  let totalPercentage = 0;
  let topicCount = 0;
  
  weaknesses.forEach(subject => {
    subject.topics.forEach(topic => {
      totalPercentage += topic.percentage;
      topicCount++;
    });
  });
  
  const averagePercentage = topicCount > 0 ? totalPercentage / topicCount : 0;
  
  if (config.scoreSystem === 'jamb') {
    return Math.round(200 + (averagePercentage / 100) * 200);
  } else if (config.scoreSystem === 'sat') {
    return Math.round(800 + (averagePercentage / 100) * 800);
  }
  return Math.round(averagePercentage);
};

export const getScoreLabel = (score: number, examType: ExamType): string => {
  const config = EXAM_CONFIGS[examType];
  if (config.scoreSystem === 'waec' || config.scoreSystem === 'ican') {
    if (score >= 90) return 'A1';
    if (score >= 80) return 'B2';
    if (score >= 70) return 'B3';
    if (score >= 60) return 'C4';
    if (score >= 55) return 'C5';
    if (score >= 50) return 'C6';
    if (score >= 45) return 'D7';
    if (score >= 40) return 'E8';
    return 'F9';
  }
  return `${score}/${config.maxScore}`;
};

export const getDaysUntilExam = (examDate?: Date): number => {
  if (!examDate) return 0;
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
