import React from 'react';
import { Users, MessageCircle, Clock, Sparkles, ArrowRight } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="card h-full flex items-center justify-center animate-fade-in">
      <div className="text-center max-w-lg px-6">
        {/* Icon */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto">
            <Users className="h-12 w-12 text-primary-600" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-warning-400 to-warning-500 rounded-full flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h2 className="text-2xl font-bold text-secondary-900">Ready to Start Interviews</h2>
          <p className="text-secondary-600 leading-relaxed">
            Your dashboard is ready! Switch to the <strong>Take Interview</strong> tab to conduct your first 
            AI-powered technical interview. All completed interviews will appear here for review.
          </p>
        </div>

        {/* Features */}
        <div className="card bg-gradient-to-br from-secondary-50 to-primary-50/30 border-secondary-200/50">
          <div className="card-body space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">What you'll track:</h3>
              <ArrowRight className="h-5 w-5 text-primary-600" />
            </div>
            
            <div className="grid gap-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-secondary-900 mb-1">Interview Conversations</h4>
                  <p className="text-sm text-secondary-600">Complete Q&A history with timestamps</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-success-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-secondary-900 mb-1">Performance Analytics</h4>
                  <p className="text-sm text-secondary-600">Response times and completion rates</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-warning-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-secondary-900 mb-1">AI Assessment Scores</h4>
                  <p className="text-sm text-secondary-600">Detailed evaluations and recommendations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;