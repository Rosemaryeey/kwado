import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Target, CheckCircle, AlertCircle, ChevronRight, Play, RotateCcw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { MOCK_SUBJECTS } from '@/data/mockData';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { currentSession, startPracticeSession, submitPracticeAnswer, completePracticeSession } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const subjects = MOCK_SUBJECTS;
  const topics = selectedSubject ? subjects.find(s => s.id === selectedSubject)?.topics || [] : [];

  const handleStart = () => {
    startPracticeSession(selectedSubject, selectedTopic);
    setIsStarted(true);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer === null) {
      setSelectedAnswer(index);
      submitPracticeAnswer(currentQuestion, index);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    if (currentQuestion < (currentSession?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completePracticeSession();
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setIsStarted(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSelectedSubject('');
    setSelectedTopic('');
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
              <h1 className="text-2xl font-display font-bold text-kwado-text">Practice Mode</h1>
              <p className="text-sm text-kwado-text-muted">Customize your practice session</p>
            </div>
          </div>

          <div className="kwado-card p-6 space-y-6">
            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-kwado-text mb-3">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Select Subject
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id);
                      setSelectedTopic('');
                    }}
                    className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                      selectedSubject === subject.id
                        ? 'border-kwado-green bg-kwado-green/10'
                        : 'border-kwado-border hover:border-kwado-green/50'
                    }`}
                  >
                    <span className="text-sm font-medium text-kwado-text">{subject.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Selection */}
            {topics.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-kwado-text mb-3">
                  <Target className="w-4 h-4 inline mr-2" />
                  Select Topic (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTopic('')}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
                      selectedTopic === ''
                        ? 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                        : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                    }`}
                  >
                    All Topics
                  </button>
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic.id)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
                        selectedTopic === topic.id
                          ? 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                          : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                      }`}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty Selection */}
            <div>
              <label className="block text-sm font-medium text-kwado-text mb-3">
                <Filter className="w-4 h-4 inline mr-2" />
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`flex-1 py-3 px-4 rounded-xl border text-sm font-medium capitalize transition-all duration-200 ${
                      selectedDifficulty === diff
                        ? 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                        : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              disabled={!selectedSubject}
              className="w-full kwado-btn-primary py-4"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Practice
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

    return (
      <div className="min-h-screen bg-kwado-bg p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="kwado-card p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-kwado-green/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-kwado-green" />
            </div>
            <h1 className="text-3xl font-display font-bold text-kwado-text mb-2">
              Practice Complete!
            </h1>
            <p className="text-kwado-text-muted mb-8">
              Here's how you performed
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-kwado-green/5 border border-kwado-green/20">
                <p className="text-3xl font-display font-bold text-kwado-green">{score}%</p>
                <p className="text-sm text-kwado-text-muted">Score</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className="text-3xl font-display font-bold text-blue-500">{correctAnswers}</p>
                <p className="text-sm text-kwado-text-muted">Correct</p>
              </div>
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <p className="text-3xl font-display font-bold text-purple-500">{currentSession.questions.length}</p>
                <p className="text-sm text-kwado-text-muted">Questions</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleRestart}
                variant="outline"
                className="kwado-btn-secondary flex-1"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Practice Again
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="kwado-btn-primary flex-1"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const question = currentSession?.questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correctAnswer;

  return (
    <div className="min-h-screen bg-kwado-bg p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-kwado-text-muted hover:text-kwado-text transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Practice
          </button>
          <span className="text-sm text-kwado-text-muted">
            Question {currentQuestion + 1} of {currentSession?.questions.length}
          </span>
        </div>

        {/* Progress */}
        <div className="kwado-progress mb-6">
          <div 
            className="kwado-progress-bar" 
            style={{ width: `${((currentQuestion + 1) / (currentSession?.questions.length || 1)) * 100}%` }} 
          />
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
              const showCorrect = selectedAnswer !== null && isCorrectAnswer;
              const showWrong = isSelected && !isCorrectAnswer;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`quiz-option ${
                    showCorrect ? 'quiz-option-correct' : ''
                  } ${showWrong ? 'quiz-option-wrong' : ''} ${
                    selectedAnswer !== null && !isSelected && !isCorrectAnswer ? 'quiz-option-disabled opacity-50' : ''
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

        {/* Next Button */}
        {selectedAnswer !== null && (
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              className="kwado-btn-primary"
            >
              {currentQuestion === (currentSession?.questions.length || 0) - 1 ? 'Finish' : 'Next Question'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Practice;
