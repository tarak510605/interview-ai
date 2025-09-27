import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InterviewState } from './interviewSlice';

export interface Candidate {
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  resumeFileName: string;
  score: number;
  summary: string;
  questions: any[];
  startTime: string;
  endTime?: string;
  isCompleted: boolean;
}

interface CandidatesState {
  candidates: Candidate[];
  searchTerm: string;
  sortBy: 'name' | 'score' | 'date';
  sortOrder: 'asc' | 'desc';
}

const initialState: CandidatesState = {
  candidates: [],
  searchTerm: '',
  sortBy: 'score',
  sortOrder: 'desc',
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action: PayloadAction<InterviewState>) => {
      const interview = action.payload;
      const candidate: Candidate = {
        sessionId: interview.sessionId,
        name: interview.candidateInfo.name,
        email: interview.candidateInfo.email,
        phone: interview.candidateInfo.phone,
        resumeFileName: interview.candidateInfo.resumeFileName,
        score: interview.score,
        summary: interview.summary,
        questions: interview.questions,
        startTime: interview.startTime!,
        endTime: interview.endTime,
        isCompleted: interview.isCompleted,
      };
      
      // Remove existing candidate with same session ID
      state.candidates = state.candidates.filter(c => c.sessionId !== candidate.sessionId);
      state.candidates.push(candidate);
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortBy: (state, action: PayloadAction<{ sortBy: 'name' | 'score' | 'date'; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
  },
});

export const { addCandidate, setSearchTerm, setSortBy } = candidatesSlice.actions;

export default candidatesSlice.reducer;