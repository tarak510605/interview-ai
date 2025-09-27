import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Search, ArrowUpDown, User, Trophy, Calendar, Users2 } from 'lucide-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { setSearchTerm, setSortBy } from '../../store/slices/candidatesSlice';

interface CandidateListProps {
  selectedCandidateId: string | null;
  onSelectCandidate: (candidateId: string) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({
  selectedCandidateId,
  onSelectCandidate,
}) => {
  const dispatch = useDispatch();
  const { candidates, searchTerm, sortBy, sortOrder } = useTypedSelector((state) => state.candidates);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'date':
          comparison = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [candidates, searchTerm, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: 'name' | 'score' | 'date') => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setSortBy({ sortBy: newSortBy, sortOrder: newSortOrder }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success-100 text-success-700 border border-success-200';
    if (score >= 60) return 'bg-warning-100 text-warning-700 border border-warning-200';
    return 'bg-danger-100 text-danger-700 border border-danger-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card h-full flex flex-col">
      {/* Header */}
      <div className="card-header">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-secondary-900">
              Candidates
            </h2>
            <p className="text-sm text-secondary-600 mt-1">
              {candidates.length} total interviews
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-secondary-600">
            <Users2 className="h-4 w-4" />
            <span>{candidates.filter(c => c.isCompleted).length} completed</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="input-field pl-10"
          />
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleSortChange('name')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'name'
                ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border border-transparent'
            }`}
          >
            <User className="h-4 w-4" />
            <span>Name</span>
            {sortBy === 'name' && (
              <ArrowUpDown className={`h-3 w-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSortChange('score')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'score'
                ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border border-transparent'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span>Score</span>
            {sortBy === 'score' && (
              <ArrowUpDown className={`h-3 w-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
          <button
            onClick={() => handleSortChange('date')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              sortBy === 'date'
                ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm'
                : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 border border-transparent'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Date</span>
            {sortBy === 'date' && (
              <ArrowUpDown className={`h-3 w-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>

      {/* Candidate List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedCandidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
              <Users2 className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              {searchTerm ? 'No matches found' : 'No candidates yet'}
            </h3>
            <p className="text-secondary-600 max-w-sm">
              {searchTerm 
                ? 'Try adjusting your search terms to find candidates.'
                : 'Candidates will appear here after they complete interviews.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredAndSortedCandidates.map((candidate) => (
              <button
                key={candidate.sessionId}
                onClick={() => onSelectCandidate(candidate.sessionId)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                  selectedCandidateId === candidate.sessionId 
                    ? 'bg-primary-50 border-2 border-primary-200 shadow-medium' 
                    : 'hover:bg-secondary-50 border-2 border-transparent hover:border-secondary-200 hover:shadow-soft'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-secondary-900 truncate group-hover:text-primary-700 transition-colors">
                      {candidate.name || 'Anonymous Candidate'}
                    </h3>
                    <p className="text-sm text-secondary-600 truncate mt-1">
                      {candidate.email}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}>
                      {candidate.score}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-secondary-500">
                    {formatDate(candidate.startTime)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    candidate.isCompleted 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-warning-100 text-warning-700'
                  }`}>
                    {candidate.isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateList;