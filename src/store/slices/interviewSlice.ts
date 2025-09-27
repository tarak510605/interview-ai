import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { scoreAnswer, getPredefinedAnswerByQuestionText } from '../../utils/answerScoring';

export interface Question {
  id: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: number;
  answer?: string;
  timeSpent?: number;
  timestamp?: string;
  score?: number;
  maxScore?: number;
  feedback?: string;
  keyPointsMatched?: string[];
  keyPointsMissed?: string[];
}

export interface InterviewState {
  candidateInfo: {
    name: string;
    email: string;
    phone: string;
    resumeContent: string;
    resumeFileName: string;
  };
  questions: Question[];
  currentQuestionIndex: number;
  isActive: boolean;
  isCompleted: boolean;
  timeRemaining: number;
  score: number;
  summary: string;
  sessionId: string;
  startTime?: string;
  endTime?: string;
}

const initialState: InterviewState = {
  candidateInfo: {
    name: '',
    email: '',
    phone: '',
    resumeContent: '',
    resumeFileName: '',
  },
  questions: [],
  currentQuestionIndex: 0,
  isActive: false,
  isCompleted: false,
  timeRemaining: 0,
  score: 0,
  summary: '',
  sessionId: '',
  startTime: undefined,
  endTime: undefined,
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setCandidateInfo: (state, action: PayloadAction<Partial<InterviewState['candidateInfo']>>) => {
      state.candidateInfo = { ...state.candidateInfo, ...action.payload };
    },
    initializeInterview: (state) => {
      state.sessionId = `session_${Date.now()}`;
      state.questions = generateQuestions();
      state.currentQuestionIndex = 0;
      state.isActive = true;
      state.isCompleted = false;
      state.timeRemaining = state.questions[0]?.timeLimit || 0;
      state.startTime = new Date().toISOString();
      state.score = 0;
      state.summary = '';
    },
    startTimer: (state) => {
      if (state.questions[state.currentQuestionIndex]) {
        state.timeRemaining = state.questions[state.currentQuestionIndex].timeLimit;
      }
    },
    decrementTimer: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    submitAnswer: (state, action: PayloadAction<{ answer: string; timeSpent: number }>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion) {
        currentQuestion.answer = action.payload.answer;
        currentQuestion.timeSpent = action.payload.timeSpent;
        currentQuestion.timestamp = new Date().toISOString();
        
        // Score the answer using predefined answers
        const predefinedAnswer = getPredefinedAnswerByQuestionText(currentQuestion.text);
        if (predefinedAnswer) {
          const scoringResult = scoreAnswer(action.payload.answer, predefinedAnswer);
          currentQuestion.score = scoringResult.score;
          currentQuestion.maxScore = scoringResult.maxScore;
          currentQuestion.feedback = scoringResult.feedback;
          currentQuestion.keyPointsMatched = scoringResult.keyPointsMatched;
          currentQuestion.keyPointsMissed = scoringResult.keyPointsMissed;
        }
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
        state.timeRemaining = state.questions[state.currentQuestionIndex].timeLimit;
      } else {
        state.isActive = false;
        state.isCompleted = true;
        state.endTime = new Date().toISOString();
        // Generate final score and summary
        const { score, summary } = generateFinalAssessment(state.questions);
        state.score = score;
        state.summary = summary;
      }
    },
    resetInterview: (state) => {
      return { ...initialState, candidateInfo: state.candidateInfo };
    },
    restoreSession: (_state, action: PayloadAction<InterviewState>) => {
      return action.payload;
    },
  },
});

// Helper function to generate interview questions
function generateQuestions(): Question[] {
  const easyQuestions = [
    "What is the difference between let, const, and var in JavaScript?",
    "Explain the concept of React components and their benefits.",
    "What is the purpose of package.json in a Node.js project?",
    "How do you handle asynchronous operations in JavaScript?",
  ];

  const mediumQuestions = [
    "Explain the concept of React Hooks and provide examples of useState and useEffect.",
    "What is middleware in Express.js and how would you implement authentication middleware?",
    "Describe the differences between SQL and NoSQL databases with examples.",
    "How would you optimize the performance of a React application?",
  ];

  const hardQuestions = [
    "Design a system architecture for a real-time chat application with scalability in mind.",
    "Explain database indexing strategies and when you would use different types of indexes.",
    "How would you implement server-side rendering (SSR) in a React application and what are the trade-offs?",
    "Describe how you would handle race conditions in a multi-threaded Node.js application.",
  ];

  const selectedQuestions: Question[] = [];
  
  // Select 2 easy questions
  for (let i = 0; i < 2; i++) {
    selectedQuestions.push({
      id: `easy_${i}`,
      text: easyQuestions[Math.floor(Math.random() * easyQuestions.length)],
      difficulty: 'Easy',
      timeLimit: 20,
    });
  }

  // Select 2 medium questions
  for (let i = 0; i < 2; i++) {
    selectedQuestions.push({
      id: `medium_${i}`,
      text: mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)],
      difficulty: 'Medium',
      timeLimit: 60,
    });
  }

  // Select 2 hard questions
  for (let i = 0; i < 2; i++) {
    selectedQuestions.push({
      id: `hard_${i}`,
      text: hardQuestions[Math.floor(Math.random() * hardQuestions.length)],
      difficulty: 'Hard',
      timeLimit: 120,
    });
  }

  return selectedQuestions;
}

// Helper function to generate final assessment
function generateFinalAssessment(questions: Question[]): { score: number; summary: string } {
  let totalScore = 0;
  let maxTotalScore = 0;
  let completedQuestions = 0;
  const performanceByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
  const maxByDifficulty = { Easy: 0, Medium: 0, Hard: 0 };

  questions.forEach((question) => {
    if (question.answer) {
      completedQuestions++;
      if (question.score !== undefined && question.maxScore !== undefined) {
        totalScore += question.score;
        maxTotalScore += question.maxScore;
        performanceByDifficulty[question.difficulty] += question.score;
        maxByDifficulty[question.difficulty] += question.maxScore;
      }
    } else {
      // Add max score to total possible even if not answered
      const maxScore = question.difficulty === 'Easy' ? 20 : question.difficulty === 'Medium' ? 30 : 40;
      maxTotalScore += maxScore;
      maxByDifficulty[question.difficulty] += maxScore;
    }
  });

  const finalScore = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 100) : 0;
  
  // Calculate performance percentages by difficulty
  const easyPerf = maxByDifficulty.Easy > 0 ? Math.round((performanceByDifficulty.Easy / maxByDifficulty.Easy) * 100) : 0;
  const mediumPerf = maxByDifficulty.Medium > 0 ? Math.round((performanceByDifficulty.Medium / maxByDifficulty.Medium) * 100) : 0;
  const hardPerf = maxByDifficulty.Hard > 0 ? Math.round((performanceByDifficulty.Hard / maxByDifficulty.Hard) * 100) : 0;
  
  const summary = `
Interview Assessment Summary:

• Completed ${completedQuestions}/6 questions
• Overall Score: ${totalScore}/${maxTotalScore} (${finalScore}%)
• Performance Level: ${finalScore >= 80 ? 'Excellent' : finalScore >= 60 ? 'Good' : finalScore >= 40 ? 'Average' : 'Needs Improvement'}

Performance by Difficulty:
• Easy Questions: ${easyPerf}% (${performanceByDifficulty.Easy}/${maxByDifficulty.Easy} points)
• Medium Questions: ${mediumPerf}% (${performanceByDifficulty.Medium}/${maxByDifficulty.Medium} points)  
• Hard Questions: ${hardPerf}% (${performanceByDifficulty.Hard}/${maxByDifficulty.Hard} points)

Strengths:
• ${finalScore >= 70 ? 'Strong technical knowledge demonstrated' : 'Basic understanding shown'}
• ${completedQuestions === 6 ? 'Completed all questions' : `Answered ${completedQuestions} out of 6 questions`}
• Individual question feedback provided for improvement

Areas for Improvement:
• Review feedback for each question to understand key concepts missed
• Focus on covering all key points in your answers
• Practice explaining technical concepts clearly and comprehensively

Recommendation: ${finalScore >= 70 ? 'Proceed to next interview round' : 'Review technical fundamentals and consider additional practice'}
  `;

  return { score: finalScore, summary };
}

export const {
  setCandidateInfo,
  initializeInterview,
  startTimer,
  decrementTimer,
  submitAnswer,
  nextQuestion,
  resetInterview,
  restoreSession,
} = interviewSlice.actions;

export default interviewSlice.reducer;