import React from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { Question } from '../../store/slices/interviewSlice';

interface QuestionScoreProps {
  question: Question;
  questionNumber: number;
}

const QuestionScore: React.FC<QuestionScoreProps> = ({ question, questionNumber }) => {
  if (!question.answer) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-700">Question {questionNumber}</h3>
          <span className="text-sm text-gray-500">Not answered</span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{question.text}</p>
        <div className="text-sm text-gray-500">No response provided</div>
      </div>
    );
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPerformanceIcon = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (percentage >= 60) return <TrendingUp className="h-5 w-5 text-blue-500" />;
    if (percentage >= 40) return <AlertCircle className="h-5 w-5 text-amber-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const score = question.score || 0;
  const maxScore = question.maxScore || 0;
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium text-gray-900">Question {questionNumber}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getPerformanceIcon(score, maxScore)}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(score, maxScore)}`}>
            {score}/{maxScore} ({percentage}%)
          </span>
        </div>
      </div>

      {/* Question Text */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 mb-2 font-medium">Question:</p>
        <p className="text-sm text-gray-600">{question.text}</p>
      </div>

      {/* User Answer */}
      <div className="mb-3">
        <p className="text-sm text-gray-700 mb-2 font-medium">Your Answer:</p>
        <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 max-h-24 overflow-y-auto">
          {question.answer}
        </div>
      </div>

      {/* Time Spent */}
      {question.timeSpent && (
        <div className="mb-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Time spent:</span> {Math.floor(question.timeSpent / 60)}:{(question.timeSpent % 60).toString().padStart(2, '0')} 
            <span className="text-gray-500 ml-1">
              (limit: {Math.floor(question.timeLimit / 60)}:{(question.timeLimit % 60).toString().padStart(2, '0')})
            </span>
          </p>
        </div>
      )}

      {/* Key Points */}
      {(question.keyPointsMatched?.length || question.keyPointsMissed?.length) && (
        <div className="mb-3">
          {question.keyPointsMatched && question.keyPointsMatched.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium text-green-700 mb-1">✓ Key points covered:</p>
              <ul className="text-sm text-green-600 ml-4">
                {question.keyPointsMatched.map((point, index) => (
                  <li key={index} className="mb-1">• {point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {question.keyPointsMissed && question.keyPointsMissed.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">✗ Key points missed:</p>
              <ul className="text-sm text-red-600 ml-4">
                {question.keyPointsMissed.map((point, index) => (
                  <li key={index} className="mb-1">• {point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {question.feedback && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <p className="text-sm font-medium text-blue-800 mb-1">Feedback:</p>
          <p className="text-sm text-blue-700">{question.feedback}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionScore;