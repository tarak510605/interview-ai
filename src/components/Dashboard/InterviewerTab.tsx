import React, { useState } from 'react';
import { User } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import CandidateList from './CandidateList';
import CandidateDetail from './CandidateDetail';
import EmptyState from './EmptyState';

const InterviewerTab: React.FC = () => {
  const candidates = useTypedSelector((state) => state.candidates.candidates);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const selectedCandidate = candidates.find(c => c.sessionId === selectedCandidateId);

  if (candidates.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-12rem)] animate-slide-up">
      {/* Candidate List */}
      <div className="lg:col-span-1">
        <CandidateList
          selectedCandidateId={selectedCandidateId}
          onSelectCandidate={setSelectedCandidateId}
        />
      </div>

      {/* Candidate Detail */}
      <div className="lg:col-span-2">
        {selectedCandidate ? (
          <CandidateDetail candidate={selectedCandidate} />
        ) : (
          <div className="card h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Select a candidate
                </h3>
                <p className="text-secondary-600 max-w-sm">
                  Choose a candidate from the list to view their interview details and performance.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerTab;