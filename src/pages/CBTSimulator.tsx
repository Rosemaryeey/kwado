import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle, Target, RotateCcw, BookOpen, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { EXAM_CONFIGS } from '@/data/mockData';
import type { ExamType } from '@/types';

const CBTSimulator: React.FC = () => {
  const navigate = useNavigate();
  const { user, startPracticeSession, currentSession, submitPracticeAnswer, completePracticeSession } = useApp();
  const [selectedExam, setSelectedExam] = useState<ExamType>(user?.examType || 'JAMB');
  const [isStarted, setIsStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());

  const examConfig = EXAM_CONFIGS[selectedExam];

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && isStarted && !showResults) {
      handleComplete();
    }
  }, [timeLeft, isStarted, showResults]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    startPracticeSession();
    setTimeLeft((examConfig.timeLimit || 120) * 60);
    setIsStarted(true);
  };

  const handleAnswerSelect = (index: number) => {
    if (!answeredQuestions.has(currentQuestion)) {
      setSelectedAnswer(index);
      submitPracticeAnswer(currentQuestion, index);
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]));
    }
  };

  const handleNext = () => {
    if (currentQuestion < (currentSession?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(currentSession?.answers[currentQuestion + 1] ?? null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(currentSession?.answers[currentQuestion - 1] ?? null);
    }
  };

  const handleComplete = () => {
    completePracticeSession();
    setShowResults(true);
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(currentSession?.answers[index] ?? null);
  };

  const handleRestart = () => {
    setIsStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnsweredQuestions(new Set());
    setTimeLeft(0);
  };

  // Setup Screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-kwado-bg p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-xl bg-kwado-card border border-kwado-border flex items-center justify-center hover:border-kwado-green/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-kwado-text" />
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold text-kwado-text">CBT Simulator</h1>
              <p className="text-sm text-kwado-text-muted">Experience the real exam environment</p>
            </div>
          </div>

          <div className="kwado-card p-6 space-y-6">
            {/* Exam Selection */}
            <div>
              <label className="block text-sm font-medium text-kwado-text mb-3">
                <Target className="w-4 h-4 inline mr-2" />
                Select Exam Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(EXAM_CONFIGS).map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setSelectedExam(exam as ExamType)}
                    className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                      selectedExam === exam
                        ? 'border-kwado-green bg-kwado-green/10'
                        : 'border-kwado-border hover:border-kwado-green/50'
                    }`}
                  >
                    <span className="text-sm font-medium text-kwado-text">{exam}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Details */}
            <div className="p-4 rounded-xl bg-kwado-bg border border-kwado-border">
              <h3 className="font-semibold text-kwado-text mb-3">Exam Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-kwado-text-muted">Time Limit:</span>
                  <span className="text-kwado-text ml-2">{examConfig.timeLimit || 120} minutes</span>
                </div>
                <div>
                  <span className="text-kwado-text-muted">Max Score:</span>
                  <span className="text-kwado-text ml-2">{examConfig.maxScore}</span>
                </div>
                <div>
                  <span className="text-kwado-text-muted">Subjects:</span>
                  <span className="text-kwado-text ml-2">Up to {examConfig.maxSubjects}</span>
                </div>
                <div>
                  <span className="text-kwado-text-muted">Format:</span>
                  <span className="text-kwado-text ml-2">Multiple Choice</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <h3 className="font-semibold text-kwado-text mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                Instructions
              </h3>
              <ul className="text-sm text-kwado-text-muted space-y-1">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions</li>
                <li>• Timer will start once you begin</li>
                <li>• Submit when you're done or time runs out</li>
              </ul>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              className="w-full kwado-btn-primary py-4"
            >
              Start CBT Simulation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults && currentSession) {
    const correctAnswers = currentSession.questions.filter((q, i) => 
      currentSession.answers[i] === q.correctAnswer
    ).length;
    const score = Math.round((correctAnswers / currentSession.questions.length) * 100);
    const timeSpent = (examConfig.timeLimit || 120) * 60 - timeLeft;

    return (
      <div className="min-h-screen bg-kwado-bg p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="kwado-card p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-kwado-green/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-kwado-green" />
              </div>
              <h1 className="text-3xl font-display font-bold text-kwado-text mb-2">
                CBT Simulation Complete!
              </h1>
              <p className="text-kwado-text-muted">
                Here's your performance summary
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-kwado-green/5 border border-kwado-green/20 text-center">
                <p className="text-3xl font-display font-bold text-kwado-green">{score}%</p>
                <p className="text-sm text-kwado-text-muted">Score</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
                <p className="text-3xl font-display font-bold text-blue-500">{correctAnswers}</p>
                <p className="text-sm text-kwado-text-muted">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
                <p className="text-3xl font-display font-bold text-purple-500">
                  {Math.round(timeSpent / 60)}m
                </p>
                <p className="text-sm text-kwado-text-muted">Time Spent</p>
              </div>
              <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 text-center">
                <p className="text-3xl font-display font-bold text-yellow-500">
                  {Math.round((correctAnswers / currentSession.questions.length) * 100)}%
                </p>
                <p className="text-sm text-kwado-text-muted">Accuracy</p>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div className="mb-8">
              <h3 className="font-semibold text-kwado-text mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-kwado-green" />
                Subject Breakdown
              </h3>
              <div className="space-y-3">
                {Array.from(new Set(currentSession.questions.map(q => q.subjectId))).map((subjectId) => {
                  const subjectQuestions = currentSession.questions.filter(q => q.subjectId === subjectId);
                  const subjectCorrect = subjectQuestions.filter((q) => {
                    const questionIndex = currentSession.questions.indexOf(q);
                    return currentSession.answers[questionIndex] === q.correctAnswer;
                  }).length;
                  const subjectPercentage = Math.round((subjectCorrect / subjectQuestions.length) * 100);

                  return (
                    <div key={subjectId} className="flex items-center gap-4 p-3 rounded-xl border border-kwado-border">
                      <span className="flex-1 text-sm text-kwado-text">{subjectId}</span>
                      <div className="w-32">
                        <div className="kwado-progress">
                          <div 
                            className="kwado-progress-bar" 
                            style={{ 
                              width: `${subjectPercentage}%`,
                              backgroundColor: subjectPercentage >= 70 ? '#22C55E' : subjectPercentage >= 50 ? '#EAB308' : '#EF4444'
                            }} 
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-kwado-text w-12 text-right">{subjectPercentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="kwado-btn-secondary flex-1"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Retake Test
              </Button>
              <Button
                onClick={() => navigate('/practice')}
                variant="outline"
                className="kwado-btn-secondary flex-1"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Review Mistakes
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="kwado-btn-primary flex-1"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const question = currentSession?.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-kwado-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-kwado-card border-b border-kwado-border px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-kwado-text-muted hover:text-kwado-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-kwado-bg border border-kwado-border">
              <Clock className="w-5 h-5 text-kwado-green" />
              <span className="font-mono font-medium text-kwado-text">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-kwado-text-muted">
                Question {currentQuestion + 1} of {currentSession?.questions.length}
              </span>
              <span className="text-sm text-kwado-text-muted">
                {Math.round(((currentQuestion + 1) / (currentSession?.questions.length || 1)) * 100)}% Complete
              </span>
            </div>
            <div className="kwado-progress">
              <div 
                className="kwado-progress-bar" 
                style={{ width: `${((currentQuestion + 1) / (currentSession?.questions.length || 1)) * 100}%` }} 
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Question Card */}
            <div className="lg:col-span-3">
              <div className="kwado-card p-6 sm:p-8">
                <h2 className="text-xl font-medium text-kwado-text mb-6">
                  {question?.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {question?.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isAnswered = answeredQuestions.has(currentQuestion);

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isAnswered}
                        className={`quiz-option ${
                          isSelected ? 'border-kwado-green bg-kwado-green/10' : ''
                        } ${isAnswered && !isSelected ? 'quiz-option-disabled opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-lg bg-kwado-bg flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span>{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  variant="ghost"
                  className="text-kwado-text-muted hover:text-kwado-text"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </Button>
                {currentQuestion === (currentSession?.questions.length || 0) - 1 ? (
                  <Button
                    onClick={handleComplete}
                    className="kwado-btn-primary"
                  >
                    Submit Exam
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="kwado-btn-primary"
                  >
                    Next
                    <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                  </Button>
                )}
              </div>
            </div>

            {/* Question Navigator */}
            <div className="lg:col-span-1">
              <div className="kwado-card p-4 sticky top-24">
                <p className="text-sm font-medium text-kwado-text mb-3">Questions</p>
                <div className="grid grid-cols-5 gap-2">
                  {currentSession?.questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                        index === currentQuestion
                          ? 'bg-kwado-green text-white'
                          : answeredQuestions.has(index)
                          ? 'bg-kwado-green/20 text-kwado-green'
                          : 'bg-kwado-border text-kwado-text-muted hover:bg-kwado-green/10'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-kwado-border">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded bg-kwado-green" />
                    <span className="text-kwado-text-muted">Current</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-2">
                    <div className="w-4 h-4 rounded bg-kwado-green/20" />
                    <span className="text-kwado-text-muted">Answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBTSimulator;
