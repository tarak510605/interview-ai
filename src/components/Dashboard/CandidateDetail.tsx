import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Clock, MessageSquare, Trophy } from 'lucide-react';
import { Candidate } from '../../store/slices/candidatesSlice';

interface CandidateDetailProps {
  candidate: Candidate;
}

const CandidateDetail: React.FC<CandidateDetailProps> = ({ candidate }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'chat' | 'summary'>('profile');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.round(durationMs / (1000 * 60));
    return `${minutes} minutes`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-amber-600 bg-amber-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{candidate.name}</h2>
            <p className="text-sm text-gray-600 mt-1">{candidate.email}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}/100
            </div>
            <p className="text-xs text-gray-500">Overall Score</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-8 mt-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
          >
            <MessageSquare className="h-4 w-4" />
            <span>Chat History</span>
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`${
              activeTab === 'summary'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200`}
          >
            <Trophy className="h-4 w-4" />
            <span>AI Summary</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{candidate.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{candidate.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Resume Information */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Resume</p>
                <p className="text-sm text-gray-600">{candidate.resumeFileName}</p>
              </div>
            </div>

            {/* Interview Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">Duration</p>
                </div>
                <p className="text-lg font-semibold text-blue-900 mt-1">
                  {formatDuration(candidate.startTime, candidate.endTime)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">Questions</p>
                </div>
                <p className="text-lg font-semibold text-green-900 mt-1">
                  {candidate.questions.filter(q => q.answer).length}/6
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-purple-800">Status</p>
                </div>
                <p className="text-lg font-semibold text-purple-900 mt-1">
                  {candidate.isCompleted ? 'Completed' : 'In Progress'}
                </p>
              </div>
            </div>

            {/* Interview Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Interview Timeline</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600">Started: </span>
                  <span className="font-medium">{formatDate(candidate.startTime)}</span>
                </div>
                {candidate.endTime && (
                  <div className="text-sm">
                    <span className="text-gray-600">Completed: </span>
                    <span className="font-medium">{formatDate(candidate.endTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            {candidate.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      Question {index + 1}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  {question.timestamp && (
                    <span className="text-xs text-gray-500">
                      {new Date(question.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                    <p className="text-sm text-gray-600">{question.text}</p>
                  </div>

                  {question.answer && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Answer:</p>
                      <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600">
                        {question.answer}
                      </div>
                    </div>
                  )}

                  {question.timeSpent && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Time spent: {question.timeSpent}s</span>
                      <span>Time limit: {question.timeLimit}s</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">AI Assessment</h3>
                <div className={`text-3xl font-bold ${getScoreColor(candidate.score)}`}>
                  {candidate.score}/100
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-white p-4 rounded border leading-relaxed">
                  {candidate.summary}
                </pre>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Completion Rate</h4>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(candidate.questions.filter(q => q.answer).length / candidate.questions.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {candidate.questions.filter(q => q.answer).length}/{candidate.questions.length}
                  </span>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Performance Level</h4>
                <p className={`text-sm font-medium ${getScoreColor(candidate.score)}`}>
                  {candidate.score >= 80 ? 'Excellent' : 
                   candidate.score >= 60 ? 'Good' : 
                   candidate.score >= 40 ? 'Average' : 'Needs Improvement'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;