import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, BookOpen, Award, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getScoreLabel } from '@/data/mockData';

const Diagnostic: React.FC = () => {
  const navigate = useNavigate();
  const { currentSession, submitDiagnosticAnswer, completeDiagnostic, diagnosticResult, startDiagnostic, user } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!currentSession) {
      startDiagnostic();
    }
  }, [currentSession, startDiagnostic]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults && currentSession) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleComplete();
    }
  }, [timeLeft, showResults, currentSession]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      submitDiagnosticAnswer(currentQuestion, index);
      setAnsweredQuestions(new Set([...answeredQuestions, currentQuestion]));
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (currentSession?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(currentSession?.answers[currentQuestion + 1] ?? null);
      setShowExplanation(answeredQuestions.has(currentQuestion + 1));
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(currentSession?.answers[currentQuestion - 1] ?? null);
      setShowExplanation(answeredQuestions.has(currentQuestion - 1));
    }
  };

  const handleComplete = () => {
    completeDiagnostic();
    setShowResults(true);
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestion(index);
    setSelectedAnswer(currentSession?.answers[index] ?? null);
    setShowExplanation(answeredQuestions.has(index));
  };

  if (showResults && diagnosticResult) {
    return (
      <div className="min-h-screen bg-kwado-bg p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-kwado-text-muted hover:text-kwado-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>

          {/* Results Card */}
          <div className="kwado-card p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-kwado-green/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-kwado-green" />
              </div>
              <h1 className="text-3xl font-display font-bold text-kwado-text mb-2">
                Diagnostic Complete!
              </h1>
              <p className="text-kwado-text-muted">
                Here's how you performed
              </p>
            </div>

            {/* Score Display */}
            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 rounded-xl bg-kwado-green/5 border border-kwado-green/20">
                <p className="text-sm text-kwado-text-muted mb-2">Your Score</p>
                <p className="text-4xl font-display font-bold text-kwado-green">
                  {diagnosticResult.score}%
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-sm text-kwado-text-muted mb-2">Predicted {user?.examType} Score</p>
                <p className="text-4xl font-display font-bold text-blue-500">
                  {user?.examType ? getScoreLabel(diagnosticResult.predictedScore, user.examType) : diagnosticResult.predictedScore}
                </p>
              </div>
              <div className="text-center p-6 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <p className="text-sm text-kwado-text-muted mb-2">Gap to Target</p>
                <p className={`text-4xl font-display font-bold ${diagnosticResult.targetGap > 0 ? 'text-yellow-500' : 'text-kwado-green'}`}>
                  {diagnosticResult.targetGap > 0 ? `+${diagnosticResult.targetGap}` : 'On Track'}
                </p>
              </div>
            </div>

            {/* Subject Breakdown */}
            {diagnosticResult.subjectBreakdown.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-display font-bold text-kwado-text mb-4">
                  Subject Breakdown
                </h2>
                <div className="space-y-3">
                  {diagnosticResult.subjectBreakdown.map((subject) => (
                    <div key={subject.subjectId} className="flex items-center gap-4 p-4 rounded-xl border border-kwado-border">
                      <div className="flex-1">
                        <p className="font-medium text-kwado-text">{subject.subjectName}</p>
                        <p className="text-sm text-kwado-text-muted">
                          {subject.correct}/{subject.total} correct
                        </p>
                      </div>
                      <div className="w-32">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-kwado-text-muted">{subject.percentage}%</span>
                        </div>
                        <div className="kwado-progress">
                          <div 
                            className="kwado-progress-bar" 
                            style={{ 
                              width: `${subject.percentage}%`,
                              backgroundColor: subject.percentage >= 70 ? '#22C55E' : subject.percentage >= 50 ? '#EAB308' : '#EF4444'
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="p-6 rounded-xl bg-kwado-green/5 border border-kwado-green/20">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-kwado-green" />
                  <h3 className="font-semibold text-kwado-text">Strengths</h3>
                </div>
                {diagnosticResult.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {diagnosticResult.strengths.map((strength, index) => (
                      <li key={index} className="text-sm text-kwado-text-muted flex items-start gap-2">
                        <span className="text-kwado-green mt-1">•</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-kwado-text-muted">Keep practicing to build strengths!</p>
                )}
              </div>
              <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-kwado-text">Areas to Improve</h3>
                </div>
                {diagnosticResult.weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                    {diagnosticResult.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm text-kwado-text-muted flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-kwado-text-muted">Great job! No major weaknesses found.</p>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate('/study-plan')}
                className="kwado-btn-primary flex-1"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Study Plan
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="kwado-btn-secondary flex-1"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = currentSession?.questions[currentQuestion];
  const isAnswered = answeredQuestions.has(currentQuestion);
  const isCorrect = selectedAnswer === question?.correctAnswer;

  return (
    <div className="min-h-screen bg-kwado-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-kwado-text-muted hover:text-kwado-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Diagnostic
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-kwado-card border border-kwado-border">
              <Clock className="w-5 h-5 text-kwado-green" />
              <span className="font-mono font-medium text-kwado-text">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

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

        {/* Question Card */}
        <div className="kwado-card p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-medium text-kwado-text mb-6">
            {question?.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question?.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectAnswer = index === question.correctAnswer;
              const showCorrect = isAnswered && isCorrectAnswer;
              const showWrong = isAnswered && isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`quiz-option ${
                    showCorrect ? 'quiz-option-correct' : ''
                  } ${showWrong ? 'quiz-option-wrong' : ''} ${
                    isAnswered && !isSelected && !isCorrectAnswer ? 'quiz-option-disabled opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-kwado-bg flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {showCorrect && <CheckCircle className="w-5 h-5 ml-auto" />}
                  {showWrong && <AlertCircle className="w-5 h-5 ml-auto" />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-4 rounded-xl border ${
              isCorrect ? 'border-kwado-green/30 bg-kwado-green/5' : 'border-red-500/30 bg-red-500/5'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-kwado-green" />
                    <span className="font-semibold text-kwado-green">Correct!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <span className="font-semibold text-red-500">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-kwado-text-muted">
                <span className="font-medium text-kwado-text">Explanation: </span>
                {question?.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Question Navigator */}
        <div className="kwado-card p-4 mb-6">
          <p className="text-sm text-kwado-text-muted mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
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
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="ghost"
            className="text-kwado-text-muted hover:text-kwado-text"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            className="kwado-btn-primary"
          >
            {currentQuestion === (currentSession?.questions.length || 0) - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Diagnostic;
