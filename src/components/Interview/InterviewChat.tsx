import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Clock, Send, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { 
  decrementTimer, 
  submitAnswer, 
  nextQuestion, 
  startTimer 
} from '../../store/slices/interviewSlice';
import QuestionScore from './QuestionScore';

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const interview = useTypedSelector((state) => state.interview);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = interview.questions[interview.currentQuestionIndex];

  useEffect(() => {
    if (interview.isActive && currentQuestion) {
      dispatch(startTimer());
      setStartTime(Date.now());
      setCurrentAnswer('');
    }
  }, [interview.currentQuestionIndex, dispatch, currentQuestion]);

  useEffect(() => {
    if (interview.isActive && interview.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        dispatch(decrementTimer());
      }, 1000);
    } else if (interview.timeRemaining === 0 && interview.isActive) {
      handleSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [interview.timeRemaining, interview.isActive]);

  const handleSubmit = () => {
    if (currentQuestion) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      dispatch(submitAnswer({
        answer: currentAnswer.trim() || 'No answer provided',
        timeSpent,
      }));
      dispatch(nextQuestion());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-success-700 bg-success-100 border-success-200';
      case 'Medium': return 'text-warning-700 bg-warning-100 border-warning-200';
      case 'Hard': return 'text-danger-700 bg-danger-100 border-danger-200';
      default: return 'text-secondary-700 bg-secondary-100 border-secondary-200';
    }
  };

  if (interview.isCompleted) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-success-600" />
          </div>
          <h2 className="text-3xl font-bold text-secondary-900 mb-3">Interview Completed!</h2>
          <p className="text-secondary-600 text-lg">
            Thank you for taking the time to complete our technical interview.
          </p>
        </div>

        <div className="card bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 border-primary-200">
          <div className="card-body text-center">
            <div className="mb-6">
              <div className="text-5xl font-bold text-primary-700 mb-3">
                {interview.score}
                <span className="text-2xl text-primary-600">/100</span>
              </div>
              <p className="text-lg font-medium text-primary-800">Overall Performance Score</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-primary-200/50">
              <h3 className="font-semibold text-secondary-900 mb-4">AI Assessment Summary</h3>
              <div className="text-left">
                <pre className="whitespace-pre-wrap text-sm text-secondary-700 leading-relaxed">
                  {interview.summary}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Interview Duration</h3>
            <p className="text-2xl font-bold text-blue-600">
              {interview.startTime && interview.endTime ? 
                Math.round((new Date(interview.endTime).getTime() - new Date(interview.startTime).getTime()) / 1000 / 60) : 0} minutes
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Questions Answered</h3>
            <p className="text-2xl font-bold text-green-600">
              {interview.questions.filter(q => q.answer).length}/6
            </p>
          </div>
        </div>

        {/* Detailed Question Scores */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Detailed Question Analysis</h3>
          </div>
          {interview.questions.map((question, index) => (
            <QuestionScore 
              key={question.id} 
              question={question} 
              questionNumber={index + 1} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-600">No questions available. Please restart the interview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-2 transition-all duration-300 ease-out"
          style={{ width: `${((interview.currentQuestionIndex + 1) / interview.questions.length) * 100}%` }}
        />
      </div>

      {/* Question Counter and Timer */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Question {interview.currentQuestionIndex + 1} of {interview.questions.length}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty}
          </span>
        </div>
        <div className={`flex items-center space-x-2 ${interview.timeRemaining <= 10 ? 'text-red-600' : 'text-gray-600'}`}>
          <Clock className="h-4 w-4" />
          <span className="font-mono text-sm font-medium">
            {formatTime(interview.timeRemaining)}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Question:</h3>
        <p className="text-gray-800">{currentQuestion.text}</p>
      </div>

      {/* Answer Input */}
      <div className="space-y-4">
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          disabled={interview.timeRemaining === 0}
        />
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {currentAnswer.length} characters
          </p>
          <button
            onClick={handleSubmit}
            disabled={interview.timeRemaining === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Send className="h-4 w-4" />
            <span>Submit Answer</span>
          </button>
        </div>
      </div>

      {/* Time Warning */}
      {interview.timeRemaining <= 10 && interview.timeRemaining > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 font-medium">
              Time is running out! Your answer will be automatically submitted in {interview.timeRemaining} seconds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewChat;