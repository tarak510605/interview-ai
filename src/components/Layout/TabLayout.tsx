import React, { useState } from 'react';
import { Users, MessageCircle, Briefcase, Sparkles } from 'lucide-react';
import IntervieweeTab from '../Interview/IntervieweeTab';
import InterviewerTab from '../Dashboard/InterviewerTab';

const TabLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interviewee' | 'interviewer'>('interviewee');

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-secondary-200/50 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-medium">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary-900">InterviewAI</h1>
                <p className="text-sm text-secondary-600">Smart Technical Interviews</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-secondary-600">
                <Briefcase className="h-4 w-4" />
                <span>Full Stack Developer</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex space-x-1" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('interviewee')}
              className={`${
                activeTab === 'interviewee'
                  ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
              } flex items-center space-x-2 px-4 py-3 border rounded-lg font-medium text-sm transition-all duration-200`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>Take Interview</span>
            </button>
            <button
              onClick={() => setActiveTab('interviewer')}
              className={`${
                activeTab === 'interviewer'
                  ? 'bg-primary-50 border-primary-200 text-primary-700 shadow-sm'
                  : 'border-transparent text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
              } flex items-center space-x-2 px-4 py-3 border rounded-lg font-medium text-sm transition-all duration-200`}
            >
              <Users className="h-4 w-4" />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'interviewee' ? <IntervieweeTab /> : <InterviewerTab />}
        </div>
      </main>
    </div>
  );
};

export default TabLayout;