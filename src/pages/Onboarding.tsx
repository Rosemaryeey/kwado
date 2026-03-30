import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Calendar, Target, BookOpen, Clock, CheckCircle, Sparkles, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { EXAM_SUBJECTS, EXAM_CONFIGS } from '@/data/mockData';
import type { ExamType } from '@/types';

const STEPS = [
  { id: 1, title: 'Exam Type', icon: GraduationCap },
  { id: 2, title: 'Exam Date', icon: Calendar },
  { id: 3, title: 'Target Score', icon: Target },
  { id: 4, title: 'Subjects', icon: BookOpen },
  { id: 5, title: 'Study Time', icon: Clock },
  { id: 6, title: 'Confidence', icon: CheckCircle },
];

const EXAM_TYPES: ExamType[] = ['WAEC', 'NECO', 'JAMB', 'ICAN', 'SAT', 'POST_UTME', 'UNIVERSITY'];

const STUDY_TIMES = [
  { value: 0.25, label: '15 mins/day' },
  { value: 0.5, label: '30 mins/day' },
  { value: 1, label: '1 hour/day' },
  { value: 2, label: '2 hours/day' },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentExam, updateExamDate, updateTargetScore, updateSubjects, updateDailyStudyTime } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    examType: 'JAMB' as ExamType,
    examDate: '',
    targetScore: 250,
    selectedSubjects: [] as string[],
    studyTime: 1,
    subjectConfidence: {} as Record<string, 'weak' | 'average' | 'strong'>,
  });

  const examConfig = EXAM_CONFIGS[formData.examType];
  const availableSubjects = EXAM_SUBJECTS[formData.examType] || [];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and start diagnostic
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Save all onboarding data
    setCurrentExam(formData.examType);
    if (formData.examDate) {
      updateExamDate(new Date(formData.examDate));
    }
    updateTargetScore(formData.targetScore);
    updateSubjects(formData.selectedSubjects);
    updateDailyStudyTime(formData.studyTime);
    
    // Navigate to diagnostic
    navigate('/diagnostic');
  };

  const toggleSubject = (subject: string) => {
    const maxSubjects = examConfig.maxSubjects;
    if (formData.selectedSubjects.includes(subject)) {
      setFormData({
        ...formData,
        selectedSubjects: formData.selectedSubjects.filter(s => s !== subject),
      });
    } else if (formData.selectedSubjects.length < maxSubjects) {
      setFormData({
        ...formData,
        selectedSubjects: [...formData.selectedSubjects, subject],
      });
    }
  };

  const setSubjectConfidence = (subject: string, level: 'weak' | 'average' | 'strong') => {
    setFormData({
      ...formData,
      subjectConfidence: { ...formData.subjectConfidence, [subject]: level },
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!formData.examType;
      case 2:
        return !!formData.examDate;
      case 3:
        return formData.targetScore > 0;
      case 4:
        return formData.selectedSubjects.length > 0;
      case 5:
        return formData.studyTime > 0;
      case 6:
        return formData.selectedSubjects.every(s => formData.subjectConfidence[s]);
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                Which exam are you preparing for?
              </h2>
              <p className="text-kwado-text-muted">
                We'll customize your study plan based on your exam type
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {EXAM_TYPES.map((exam) => (
                <button
                  key={exam}
                  onClick={() => {
                    setFormData({ ...formData, examType: exam, selectedSubjects: [] });
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    formData.examType === exam
                      ? 'border-kwado-green bg-kwado-green/10'
                      : 'border-kwado-border hover:border-kwado-green/50'
                  }`}
                >
                  <span className="font-semibold text-kwado-text">{exam}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                When is your exam?
              </h2>
              <p className="text-kwado-text-muted">
                We'll create a countdown and schedule your study plan
              </p>
            </div>
            <div className="max-w-sm mx-auto">
              <input
                type="date"
                value={formData.examDate}
                onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                className="kwado-input text-center text-lg py-4"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                What's your target score?
              </h2>
              <p className="text-kwado-text-muted">
                Set a realistic goal to work towards
              </p>
            </div>
            <div className="max-w-md mx-auto">
              {examConfig.scoreSystem === 'waec' || examConfig.scoreSystem === 'ican' ? (
                // Grade-based selection for WAEC/NECO/ICAN
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(examConfig.gradingSystem || {}).slice(0, 6).map(([grade]) => (
                    <button
                      key={grade}
                      onClick={() => {
                        const scoreMap: Record<string, number> = { 'A1': 95, 'B2': 85, 'B3': 75, 'C4': 65, 'C5': 57, 'C6': 52 };
                        setFormData({ ...formData, targetScore: scoreMap[grade] || 70 });
                      }}
                      className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                        formData.targetScore >= (examConfig.gradingSystem?.[grade]?.includes('90') ? 90 : 
                          examConfig.gradingSystem?.[grade]?.includes('80') ? 80 :
                          examConfig.gradingSystem?.[grade]?.includes('70') ? 70 :
                          examConfig.gradingSystem?.[grade]?.includes('60') ? 60 :
                          examConfig.gradingSystem?.[grade]?.includes('55') ? 55 :
                          examConfig.gradingSystem?.[grade]?.includes('50') ? 50 : 0)
                          ? 'border-kwado-green bg-kwado-green/10'
                          : 'border-kwado-border hover:border-kwado-green/50'
                      }`}
                    >
                      <span className="font-semibold text-kwado-text">{grade}</span>
                    </button>
                  ))}
                </div>
              ) : (
                // Score-based slider for JAMB/SAT
                <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-5xl font-display font-bold text-kwado-green">
                      {formData.targetScore}
                    </span>
                    <span className="text-kwado-text-muted text-lg">
                      /{examConfig.maxScore}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={examConfig.minScore}
                    max={examConfig.maxScore}
                    value={formData.targetScore}
                    onChange={(e) => setFormData({ ...formData, targetScore: parseInt(e.target.value) })}
                    className="w-full h-2 bg-kwado-border rounded-lg appearance-none cursor-pointer accent-kwado-green"
                  />
                  <div className="flex justify-between text-sm text-kwado-text-muted">
                    <span>{examConfig.minScore}</span>
                    <span>{examConfig.maxScore}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                Select your subjects
              </h2>
              <p className="text-kwado-text-muted">
                Choose up to {examConfig.maxSubjects} subjects for {formData.examType}
              </p>
              <p className="text-kwado-green text-sm mt-2">
                {formData.selectedSubjects.length} of {examConfig.maxSubjects} selected
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {availableSubjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => toggleSubject(subject)}
                  disabled={!formData.selectedSubjects.includes(subject) && formData.selectedSubjects.length >= examConfig.maxSubjects}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                    formData.selectedSubjects.includes(subject)
                      ? 'border-kwado-green bg-kwado-green/10'
                      : formData.selectedSubjects.length >= examConfig.maxSubjects
                      ? 'border-kwado-border opacity-50 cursor-not-allowed'
                      : 'border-kwado-border hover:border-kwado-green/50'
                  }`}
                >
                  <span className="text-sm text-kwado-text">{subject}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                How much time can you study daily?
              </h2>
              <p className="text-kwado-text-muted">
                We'll create a plan that fits your schedule
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STUDY_TIMES.map((time) => (
                <button
                  key={time.value}
                  onClick={() => setFormData({ ...formData, studyTime: time.value })}
                  className={`p-4 rounded-xl border text-center transition-all duration-200 ${
                    formData.studyTime === time.value
                      ? 'border-kwado-green bg-kwado-green/10'
                      : 'border-kwado-border hover:border-kwado-green/50'
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2 text-kwado-green" />
                  <span className="font-semibold text-kwado-text">{time.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                How confident are you in each subject?
              </h2>
              <p className="text-kwado-text-muted">
                This helps us personalize your study plan
              </p>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto p-1">
              {formData.selectedSubjects.map((subject) => (
                <div key={subject} className="kwado-card p-4">
                  <p className="font-medium text-kwado-text mb-3">{subject}</p>
                  <div className="flex gap-2">
                    {(['weak', 'average', 'strong'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setSubjectConfidence(subject, level)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-sm capitalize transition-all duration-200 ${
                          formData.subjectConfidence[subject] === level
                            ? level === 'weak'
                              ? 'border-red-500 bg-red-500/10 text-red-500'
                              : level === 'average'
                              ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                              : 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                            : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-kwado-bg flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-kwado-green/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-kwado-green/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-kwado-green flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-display font-bold text-kwado-text">Kwado</span>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-kwado-green' : 'text-kwado-text-secondary'
                }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1 transition-all duration-200 ${
                    currentStep > step.id
                      ? 'bg-kwado-green text-white'
                      : currentStep === step.id
                      ? 'bg-kwado-green/20 text-kwado-green'
                      : 'bg-kwado-border text-kwado-text-secondary'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className="text-xs hidden sm:block">{step.title}</span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                    currentStep > step.id ? 'bg-kwado-green' : 'bg-kwado-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="kwado-card p-8">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-kwado-border">
            <Button
              onClick={handleBack}
              disabled={currentStep === 1}
              variant="ghost"
              className="text-kwado-text-muted hover:text-kwado-text"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="kwado-btn-primary"
            >
              {currentStep === 6 ? 'Start Diagnostic' : 'Continue'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
