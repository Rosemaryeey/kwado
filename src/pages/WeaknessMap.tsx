import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Target, ChevronRight, BookOpen, AlertCircle, CheckCircle, Filter, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar';
import { MOCK_WEAKNESS_MAP, MOCK_SUBJECTS } from '@/data/mockData';

const WeaknessMap: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const subjects = ['all', ...MOCK_SUBJECTS.map(s => s.id)];
  
  const filteredData = selectedSubject === 'all' 
    ? MOCK_WEAKNESS_MAP 
    : MOCK_WEAKNESS_MAP.filter(item => item.subjectId === selectedSubject);

  const getProficiencyColor = (percentage: number) => {
    if (percentage >= 70) return 'bg-kwado-green';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProficiencyText = (percentage: number) => {
    if (percentage >= 70) return 'Strong';
    if (percentage >= 50) return 'Average';
    return 'Weak';
  };

  const getProficiencyIcon = (percentage: number) => {
    if (percentage >= 70) return <CheckCircle className="w-4 h-4 text-kwado-green" />;
    if (percentage >= 50) return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    return <AlertCircle className="w-4 h-4 text-red-500" />;
  };

  const weakTopics = filteredData.flatMap(subject => 
    subject.topics.filter(t => t.percentage < 50).map(t => ({ ...t, subjectName: subject.subjectName }))
  );

  return (
    <div className="min-h-screen bg-kwado-bg flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-kwado-bg/80 backdrop-blur-md border-b border-kwado-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-kwado-green/10 flex items-center justify-center">
                <Map className="w-5 h-5 text-kwado-green" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-kwado-text">Weakness Map</h1>
                <p className="text-sm text-kwado-text-muted">Identify and improve your weak areas</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Filter */}
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-kwado-text-muted flex-shrink-0" />
            {subjects.map((subjectId) => (
              <button
                key={subjectId}
                onClick={() => setSelectedSubject(subjectId)}
                className={`px-4 py-2 rounded-xl border text-sm whitespace-nowrap transition-all duration-200 ${
                  selectedSubject === subjectId
                    ? 'border-kwado-green bg-kwado-green/10 text-kwado-green'
                    : 'border-kwado-border text-kwado-text-muted hover:border-kwado-green/50'
                }`}
              >
                {subjectId === 'all' ? 'All Subjects' : MOCK_SUBJECTS.find(s => s.id === subjectId)?.name}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Heatmap */}
            <div className="lg:col-span-2 space-y-6">
              {/* Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-kwado-green" />
                  <span className="text-sm text-kwado-text-muted">Strong (70%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500" />
                  <span className="text-sm text-kwado-text-muted">Average (50-69%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500" />
                  <span className="text-sm text-kwado-text-muted">Weak (&lt;50%)</span>
                </div>
              </div>

              {/* Subject Cards */}
              {filteredData.map((subject) => (
                <div key={subject.subjectId} className="kwado-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-display font-bold text-kwado-text">
                      {subject.subjectName}
                    </h2>
                    <span className="text-sm text-kwado-text-muted">
                      {Math.round(subject.topics.reduce((acc, t) => acc + t.percentage, 0) / subject.topics.length)}% avg
                    </span>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {subject.topics.map((topic) => (
                      <div
                        key={topic.topicId}
                        className="p-4 rounded-xl border border-kwado-border hover:border-kwado-green/30 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-kwado-text">{topic.topicName}</span>
                          {getProficiencyIcon(topic.percentage)}
                        </div>
                        <div className="kwado-progress mb-2">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${getProficiencyColor(topic.percentage)}`}
                            style={{ width: `${topic.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-kwado-text-muted">
                            {getProficiencyText(topic.percentage)}
                          </span>
                          <span className="text-xs font-medium text-kwado-text">
                            {topic.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column - Weak Topics */}
            <div className="space-y-6">
              {/* Weak Topics Card */}
              <div className="kwado-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h2 className="text-lg font-display font-bold text-kwado-text">Priority Topics</h2>
                </div>
                
                {weakTopics.length > 0 ? (
                  <div className="space-y-3">
                    {weakTopics.slice(0, 5).map((topic) => (
                      <div
                        key={topic.topicId}
                        className="p-4 rounded-xl bg-red-500/5 border border-red-500/20"
                      >
                        <p className="font-medium text-kwado-text">{topic.topicName}</p>
                        <p className="text-sm text-kwado-text-muted">{topic.subjectName}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-red-500">{topic.percentage}% mastery</span>
                          <Button
                            size="sm"
                            onClick={() => navigate('/practice')}
                            className="bg-red-500 hover:bg-red-600 text-white"
                          >
                            Practice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-kwado-green mx-auto mb-3" />
                    <p className="text-kwado-text font-medium">No weak topics!</p>
                    <p className="text-sm text-kwado-text-muted">You're doing great!</p>
                  </div>
                )}

                {weakTopics.length > 0 && (
                  <Button
                    onClick={() => navigate('/practice')}
                    className="w-full kwado-btn-primary mt-4"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Revise Weak Topics
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                )}
              </div>

              {/* Tips Card */}
              <div className="kwado-card p-6">
                <h2 className="text-lg font-display font-bold text-kwado-text mb-4">Study Tips</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-kwado-text-muted">
                      Focus on weak topics first - they have the highest improvement potential.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-kwado-text-muted">
                      Spend 60% of your time on weak areas, 40% on maintaining strengths.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-kwado-green flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-kwado-text-muted">
                      Practice regularly - consistency beats intensity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WeaknessMap;
