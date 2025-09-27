import React from 'react';
import { Clock, Play, RotateCcw } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { resetInterview } from '../../store/slices/interviewSlice';

interface WelcomeBackModalProps {
  onClose: () => void;
}

const WelcomeBackModal: React.FC<WelcomeBackModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const interview = useTypedSelector((state) => state.interview);

  const handleContinue = () => {
    onClose();
  };

  const handleRestart = () => {
    dispatch(resetInterview());
    onClose();
  };

  const currentQuestion = interview.questions[interview.currentQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="text-center">
          <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">
            We found an unfinished interview session. You can continue where you left off or start over.
          </p>
        </div>

        {/* Session Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="font-medium text-gray-900">Current Progress:</h3>
          <p className="text-sm text-gray-600">
            Question {interview.currentQuestionIndex + 1} of {interview.questions.length}
          </p>
          {currentQuestion && (
            <p className="text-sm text-gray-600">
              Current: {currentQuestion.difficulty} level question
            </p>
          )}
          <p className="text-sm text-gray-600">
            Candidate: {interview.candidateInfo.name || 'Unknown'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleContinue}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Continue</span>
          </button>
          <button
            onClick={handleRestart}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Start Over</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBackModal;