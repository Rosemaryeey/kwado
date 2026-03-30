import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Sparkles, BookOpen, ChevronRight, User, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import Sidebar from '@/components/Sidebar';

const SUGGESTED_PROMPTS = [
  'Explain photosynthesis in simple terms',
  'Solve this equation: 2x + 5 = 15',
  'Explain Organic Chemistry reactions',
  'What are the causes of World War II?',
];

const AITutor: React.FC = () => {
  const navigate = useNavigate();
  const { chatMessages, sendChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = () => {
    if (input.trim()) {
      sendChatMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-kwado-bg flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-kwado-bg/80 backdrop-blur-md border-b border-kwado-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-kwado-text">AI Tutor</h1>
                <p className="text-sm text-kwado-text-muted">Ask me anything about your studies</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/practice')}
                variant="outline"
                className="kwado-btn-secondary"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Go to Practice
              </Button>
            </div>
          </div>
        </header>

        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-purple-500" />
                </div>
                <h2 className="text-2xl font-display font-bold text-kwado-text mb-2">
                  How can I help you today?
                </h2>
                <p className="text-kwado-text-muted mb-8 text-center max-w-md">
                  I'm your AI study companion. Ask me questions, get explanations, or practice problems together.
                </p>
                
                {/* Suggested Prompts */}
                <div className="grid sm:grid-cols-2 gap-3 max-w-lg">
                  {SUGGESTED_PROMPTS.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(prompt);
                        sendChatMessage(prompt);
                      }}
                      className="p-4 rounded-xl border border-kwado-border hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-200 text-left"
                    >
                      <p className="text-sm text-kwado-text">{prompt}</p>
                      <ChevronRight className="w-4 h-4 text-kwado-text-secondary mt-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-3xl mx-auto">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user' 
                        ? 'bg-kwado-green/20' 
                        : 'bg-purple-500/10'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-kwado-green" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-kwado-green text-white'
                        : 'kwado-card'
                    }`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-white/70' : 'text-kwado-text-secondary'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-kwado-border">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question..."
                    className="kwado-input pr-12"
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="kwado-btn-primary px-4"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-kwado-text-secondary text-center mt-3">
                AI responses are generated for demonstration purposes
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AITutor;
