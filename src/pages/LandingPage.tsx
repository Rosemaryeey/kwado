import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Target, Monitor, Brain, Calendar, ChevronRight, GraduationCap, Award, TrendingUp, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const exams = [
    { name: 'WAEC', description: 'Practice past questions and master your subjects.' },
    { name: 'NECO', description: 'Comprehensive prep for senior secondary exams.' },
    { name: 'JAMB', description: 'Practice past questions and predict your score.' },
    { name: 'Post-UTME', description: 'University entrance exam preparation.' },
    { name: 'ICAN', description: 'Professional accounting certification prep.' },
    { name: 'SAT', description: 'International university admission tests.' },
    { name: 'University', description: 'Course-specific exam preparation.' },
  ];

  const features = [
    { icon: Brain, title: 'Smart Diagnostic Test', description: 'Identify your strengths and weaknesses instantly.' },
    { icon: Calendar, title: 'Daily Study Plan', description: 'Personalized schedule based on your exam date.' },
    { icon: Monitor, title: 'CBT Simulator', description: 'Practice in real exam conditions.' },
  ];

  return (
    <div className="min-h-screen bg-kwado-bg">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-kwado-bg/90 backdrop-blur-md border-b border-kwado-border' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-kwado-green flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-kwado-text">Kwado</span>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="text-kwado-text-muted hover:text-kwado-text"
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="kwado-btn-primary"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/students-group.jpg)' }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-kwado-bg/80 via-kwado-bg/90 to-kwado-bg" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Centered Card */}
          <div className="kwado-card p-8 sm:p-12 max-w-2xl mx-auto animate-fade-in-up">
            <span className="kwado-eyebrow mb-4 block">AI-Powered Exam Prep</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-kwado-text mb-6">
              Study Smart.<br />
              <span className="text-kwado-green">Score Higher.</span>
            </h1>
            <p className="text-lg text-kwado-text-muted mb-8 max-w-lg mx-auto">
              Kwado builds a personalized study plan, finds your weak topics, and predicts your score—so you always know where you stand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/signup')}
                className="kwado-btn-primary text-base px-8 py-4"
              >
                Get Started
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="kwado-btn-secondary text-base px-8 py-4"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: About Kwado */}
      <section className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text Content */}
            <div className="order-2 lg:order-1">
              <span className="kwado-eyebrow mb-4 block">About Kwado</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-kwado-text mb-6">
                What is Kwado?
              </h2>
              <p className="text-kwado-text-muted text-lg mb-8 leading-relaxed">
                Kwado is a smart exam preparation platform designed for African students. It helps you study with focus, track your progress, and prepare confidently with real CBT-style practice.
              </p>
              
              {/* Highlight Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-kwado-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-kwado-text">Personalized Study Plans</h3>
                    <p className="text-sm text-kwado-text-muted">Tailored to your exam date and subjects</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-kwado-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-kwado-text">Smart Revision & Weakness Tracking</h3>
                    <p className="text-sm text-kwado-text-muted">Focus on what matters most</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center flex-shrink-0">
                    <Monitor className="w-5 h-5 text-kwado-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-kwado-text">CBT Practice for Real Exam Confidence</h3>
                    <p className="text-sm text-kwado-text-muted">Simulate the actual exam experience</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/login')}
                className="kwado-btn-primary"
              >
                Login to Start Studying
              </Button>
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="/images/about-students.jpg"
                    alt="African students studying"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative Element */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-2xl bg-kwado-green/10 -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Exams Supported */}
      <section className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="kwado-eyebrow mb-4 block">Supported Exams</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-kwado-text">
              Prepare for Major Exams with Kwado
            </h2>
          </div>

          {/* Exams Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {exams.map((exam) => (
              <div
                key={exam.name}
                className="kwado-card p-6 hover:border-kwado-green/50 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-kwado-green/20 transition-colors">
                    <GraduationCap className="w-5 h-5 text-kwado-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-kwado-text mb-1">{exam.name}</h3>
                    <p className="text-sm text-kwado-text-muted">{exam.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={() => navigate('/signup')}
              className="kwado-btn-primary"
            >
              Get Started
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section 4: Core Value + CTA */}
      <section className="min-h-screen flex items-center py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="kwado-card p-8 text-center hover:border-kwado-green/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-kwado-green/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-7 h-7 text-kwado-green" />
                </div>
                <h3 className="text-lg font-semibold text-kwado-text mb-2">{feature.title}</h3>
                <p className="text-kwado-text-muted text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Proof Elements */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {/* Progress Preview */}
            <div className="kwado-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-kwado-green" />
                <span className="font-semibold text-kwado-text">Your Progress</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-kwado-text-muted">Mathematics</span>
                    <span className="text-kwado-green font-medium">78%</span>
                  </div>
                  <div className="kwado-progress">
                    <div className="kwado-progress-bar" style={{ width: '78%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-kwado-text-muted">English</span>
                    <span className="text-kwado-green font-medium">85%</span>
                  </div>
                  <div className="kwado-progress">
                    <div className="kwado-progress-bar" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-kwado-text-muted">Physics</span>
                    <span className="text-kwado-green font-medium">62%</span>
                  </div>
                  <div className="kwado-progress">
                    <div className="kwado-progress-bar" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Score Predictor */}
            <div className="kwado-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-5 h-5 text-kwado-green" />
                <span className="font-semibold text-kwado-text">Predicted Score</span>
              </div>
              <div className="text-center py-4">
                <span className="text-5xl font-display font-bold text-kwado-green">268</span>
                <span className="text-kwado-text-muted text-lg">/400</span>
              </div>
              <p className="text-center text-sm text-kwado-text-muted">
                Based on your practice performance
              </p>
            </div>

            {/* Testimonial */}
            <div className="kwado-card p-6">
              <Quote className="w-6 h-6 text-kwado-green/50 mb-4" />
              <p className="text-kwado-text mb-4 italic">
                "Kwado helped me score 320 in JAMB. The personalized study plan and CBT practice made all the difference."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-kwado-green/20 flex items-center justify-center">
                  <span className="text-kwado-green font-semibold text-sm">CO</span>
                </div>
                <div>
                  <p className="font-medium text-kwado-text text-sm">Chidi Okonkwo</p>
                  <p className="text-xs text-kwado-text-muted">Scored 320 in JAMB 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-kwado-text mb-6">
              Start preparing today.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/signup')}
                className="kwado-btn-primary text-base px-8 py-4"
              >
                Create Account
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="kwado-btn-secondary text-base px-8 py-4"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-kwado-border py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-kwado-green flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-kwado-text">Kwado</span>
            </div>
            <div className="flex items-center gap-8">
              <a href="#" className="text-kwado-text-muted hover:text-kwado-text transition-colors text-sm">About</a>
              <a href="#" className="text-kwado-text-muted hover:text-kwado-text transition-colors text-sm">Contact</a>
              <a href="#" className="text-kwado-text-muted hover:text-kwado-text transition-colors text-sm">Terms</a>
              <a href="#" className="text-kwado-text-muted hover:text-kwado-text transition-colors text-sm">Privacy</a>
            </div>
            <p className="text-kwado-text-secondary text-sm">
              © 2025 Kwado. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
