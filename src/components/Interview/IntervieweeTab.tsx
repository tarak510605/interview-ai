import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { MessageCircle } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import ResumeUpload from './ResumeUpload';
import CandidateInfoForm from './CandidateInfoForm';
import InterviewChat from './InterviewChat';
import WelcomeBackModal from './WelcomeBackModal';
import { addCandidate } from '../../store/slices/candidatesSlice';

const IntervieweeTab: React.FC = () => {
  const dispatch = useDispatch();
  const interview = useTypedSelector((state) => state.interview);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // Check if there's an unfinished session
    if (interview.sessionId && interview.isActive && !interview.isCompleted) {
      setShowWelcomeBack(true);
    }
  }, []);

  useEffect(() => {
    // Add completed interview to candidates list
    if (interview.isCompleted && interview.sessionId) {
      dispatch(addCandidate(interview));
    }
  }, [interview.isCompleted, interview.sessionId, dispatch]);

  const handleWelcomeBackClose = () => {
    setShowWelcomeBack(false);
  };

  const getInterviewPhase = () => {
    if (!interview.candidateInfo.resumeContent) {
      return 'upload';
    }
    if (!interview.candidateInfo.name || !interview.candidateInfo.email || !interview.candidateInfo.phone) {
      return 'info';
    }
    return 'interview';
  };

  const phase = getInterviewPhase();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
          <div className="absolute top-0 right-0 w-64 h-64 transform translate-x-32 -translate-y-32">
            <div className="w-full h-full bg-white/10 rounded-full"></div>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">AI Interview Assistant</h1>
                <p className="text-primary-100">
                  Full Stack Developer Position • React & Node.js Focus
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="mt-6 flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${phase === 'upload' ? 'text-white' : 'text-primary-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  phase === 'upload' ? 'bg-white text-primary-700' : 'bg-white/20'
                }`}>1</div>
                <span className="text-sm font-medium">Upload Resume</span>
              </div>
              <div className="flex-1 h-px bg-white/20"></div>
              <div className={`flex items-center space-x-2 ${phase === 'info' ? 'text-white' : 'text-primary-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  phase === 'info' ? 'bg-white text-primary-700' : 'bg-white/20'
                }`}>2</div>
                <span className="text-sm font-medium">Personal Info</span>
              </div>
              <div className="flex-1 h-px bg-white/20"></div>
              <div className={`flex items-center space-x-2 ${phase === 'interview' ? 'text-white' : 'text-primary-200'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  phase === 'interview' ? 'bg-white text-primary-700' : 'bg-white/20'
                }`}>3</div>
                <span className="text-sm font-medium">Interview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="animate-slide-up">
            {phase === 'upload' && <ResumeUpload />}
            {phase === 'info' && <CandidateInfoForm />}
            {phase === 'interview' && <InterviewChat />}
          </div>
        </div>
      </div>

      {/* Welcome Back Modal */}
      {showWelcomeBack && (
        <WelcomeBackModal onClose={handleWelcomeBackClose} />
      )}
    </div>
  );
};

export default IntervieweeTab;