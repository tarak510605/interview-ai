/**
 * Utility functions for comparing user answers with predefined answers
 * and calculating similarity scores
 */

export interface PredefinedAnswer {
  id: string;
  questionId: string;
  modelAnswer: string;
  keyPoints: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  maxScore: number;
}

export interface ScoringResult {
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
  keyPointsMatched: string[];
  keyPointsMissed: string[];
}

/**
 * Calculate similarity between two strings using a simple approach
 * This can be enhanced with more sophisticated NLP techniques
 */
function calculateTextSimilarity(text1: string, text2: string): number {
  const normalize = (text: string) => 
    text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

  const words1 = normalize(text1).split(' ');
  const words2 = normalize(text2).split(' ');
  
  if (words1.length === 0 || words2.length === 0) return 0;

  // Calculate word overlap
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  // Jaccard similarity
  return intersection.size / union.size;
}

/**
 * Check if key points are present in the user's answer
 */
function checkKeyPoints(userAnswer: string, keyPoints: string[]): {
  matched: string[];
  missed: string[];
} {
  const normalizedAnswer = userAnswer.toLowerCase();
  const matched: string[] = [];
  const missed: string[] = [];

  keyPoints.forEach(point => {
    // Check if the key point or its important words are mentioned
    const keyWords = point.toLowerCase().split(' ').filter(word => word.length > 3);
    const isMatched = keyWords.some(word => normalizedAnswer.includes(word)) ||
                      normalizedAnswer.includes(point.toLowerCase());
    
    if (isMatched) {
      matched.push(point);
    } else {
      missed.push(point);
    }
  });

  return { matched, missed };
}

/**
 * Generate feedback based on scoring results
 */
function generateFeedback(
  score: number, 
  maxScore: number, 
  keyPointsMatched: string[], 
  keyPointsMissed: string[],
  difficulty: string
): string {
  const percentage = (score / maxScore) * 100;
  let feedback = '';

  // Overall performance
  if (percentage >= 90) {
    feedback += 'Excellent answer! ';
  } else if (percentage >= 75) {
    feedback += 'Good answer with solid understanding. ';
  } else if (percentage >= 60) {
    feedback += 'Average answer, room for improvement. ';
  } else {
    feedback += 'Below expectations, significant improvement needed. ';
  }

  // Key points feedback
  if (keyPointsMatched.length > 0) {
    feedback += `You correctly addressed: ${keyPointsMatched.join(', ')}. `;
  }

  if (keyPointsMissed.length > 0) {
    feedback += `Consider including: ${keyPointsMissed.join(', ')}. `;
  }

  // Difficulty-specific feedback
  if (difficulty === 'Easy' && percentage < 70) {
    feedback += 'This is a fundamental concept - review the basics. ';
  } else if (difficulty === 'Medium' && percentage < 60) {
    feedback += 'Practice more examples to strengthen your understanding. ';
  } else if (difficulty === 'Hard' && percentage < 50) {
    feedback += 'This is an advanced topic - seek additional resources and practice. ';
  }

  return feedback.trim();
}

/**
 * Score a user's answer against a predefined answer
 */
export function scoreAnswer(
  userAnswer: string, 
  predefinedAnswer: PredefinedAnswer
): ScoringResult {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      score: 0,
      maxScore: predefinedAnswer.maxScore,
      percentage: 0,
      feedback: 'No answer provided.',
      keyPointsMatched: [],
      keyPointsMissed: predefinedAnswer.keyPoints,
    };
  }

  // Calculate text similarity with model answer
  const textSimilarity = calculateTextSimilarity(userAnswer, predefinedAnswer.modelAnswer);
  
  // Check key points coverage
  const { matched, missed } = checkKeyPoints(userAnswer, predefinedAnswer.keyPoints);
  
  // Calculate key points score (60% of total)
  const keyPointsScore = (matched.length / predefinedAnswer.keyPoints.length) * 0.6;
  
  // Calculate text similarity score (30% of total)
  const similarityScore = textSimilarity * 0.3;
  
  // Calculate length/effort score (10% of total) - bonus for detailed answers
  const answerLength = userAnswer.trim().length;
  const lengthScore = Math.min(answerLength / 200, 1) * 0.1; // Max bonus at 200 chars
  
  // Combine scores
  const totalPercentage = keyPointsScore + similarityScore + lengthScore;
  const finalScore = Math.round(totalPercentage * predefinedAnswer.maxScore);
  
  const feedback = generateFeedback(
    finalScore,
    predefinedAnswer.maxScore,
    matched,
    missed,
    predefinedAnswer.difficulty
  );

  return {
    score: finalScore,
    maxScore: predefinedAnswer.maxScore,
    percentage: Math.round(totalPercentage * 100),
    feedback,
    keyPointsMatched: matched,
    keyPointsMissed: missed,
  };
}

/**
 * Predefined answers for the 6 interview questions
 */
export const predefinedAnswers: PredefinedAnswer[] = [
  // Easy Questions
  {
    id: 'easy_1',
    questionId: 'easy_0',
    modelAnswer: 'var is function-scoped and can be redeclared, let is block-scoped and cannot be redeclared, const is block-scoped, cannot be redeclared, and cannot be reassigned after declaration.',
    keyPoints: [
      'var is function-scoped',
      'let is block-scoped',
      'const is block-scoped',
      'var can be redeclared',
      'let cannot be redeclared',
      'const cannot be reassigned',
      'hoisting differences'
    ],
    difficulty: 'Easy',
    maxScore: 20,
  },
  {
    id: 'easy_2',
    questionId: 'easy_1',
    modelAnswer: 'React components are reusable pieces of UI that can accept props and return JSX. They promote code reusability, maintainability, and separation of concerns in building user interfaces.',
    keyPoints: [
      'reusable UI pieces',
      'accept props',
      'return JSX',
      'code reusability',
      'maintainability',
      'separation of concerns',
      'component composition'
    ],
    difficulty: 'Easy',
    maxScore: 20,
  },
  
  // Medium Questions
  {
    id: 'medium_1',
    questionId: 'medium_0',
    modelAnswer: 'React Hooks are functions that let you use state and lifecycle features in functional components. useState manages component state, useEffect handles side effects and lifecycle events like componentDidMount and componentDidUpdate.',
    keyPoints: [
      'functions for functional components',
      'useState manages state',
      'useEffect handles side effects',
      'lifecycle features',
      'no class components needed',
      'state management',
      'dependency array in useEffect'
    ],
    difficulty: 'Medium',
    maxScore: 30,
  },
  {
    id: 'medium_2',
    questionId: 'medium_1',
    modelAnswer: 'Middleware in Express.js are functions that execute during the request-response cycle. Authentication middleware can check for valid tokens, verify user credentials, and control access to protected routes.',
    keyPoints: [
      'functions in request-response cycle',
      'execute before route handlers',
      'token verification',
      'user credential validation',
      'access control',
      'next() function',
      'error handling'
    ],
    difficulty: 'Medium',
    maxScore: 30,
  },
  
  // Hard Questions
  {
    id: 'hard_1',
    questionId: 'hard_0',
    modelAnswer: 'A scalable chat system requires WebSocket connections, message queuing (Redis/RabbitMQ), load balancing, database sharding, caching strategies, and microservices architecture to handle concurrent users and message distribution.',
    keyPoints: [
      'WebSocket connections',
      'message queuing system',
      'load balancing',
      'database sharding',
      'caching strategies',
      'microservices architecture',
      'horizontal scaling',
      'real-time communication'
    ],
    difficulty: 'Hard',
    maxScore: 40,
  },
  {
    id: 'hard_2',
    questionId: 'hard_1',
    modelAnswer: 'Database indexes improve query performance by creating sorted data structures. B-tree indexes for range queries, hash indexes for equality, composite indexes for multiple columns, and covering indexes to avoid table lookups.',
    keyPoints: [
      'improve query performance',
      'sorted data structures',
      'B-tree indexes',
      'hash indexes',
      'composite indexes',
      'covering indexes',
      'query optimization',
      'index maintenance cost'
    ],
    difficulty: 'Hard',
    maxScore: 40,
  },
];

/**
 * Get predefined answer by question text (since we randomly select questions)
 */
export function getPredefinedAnswerByQuestionText(questionText: string): PredefinedAnswer | null {
  // Map question texts to their predefined answers
  const questionMap: { [key: string]: string } = {
    'What is the difference between let, const, and var in JavaScript?': 'easy_1',
    'Explain the concept of React components and their benefits.': 'easy_2',
    'Explain the concept of React Hooks and provide examples of useState and useEffect.': 'medium_1',
    'What is middleware in Express.js and how would you implement authentication middleware?': 'medium_2',
    'Design a system architecture for a real-time chat application with scalability in mind.': 'hard_1',
    'Explain database indexing strategies and when you would use different types of indexes.': 'hard_2',
  };

  const answerId = questionMap[questionText];
  return predefinedAnswers.find(answer => answer.id === answerId) || null;
}