// models/Attempt.ts

export interface Attempt {
    id: number;
    userId: number;
    questionId: number;
    isAttemptQuestion: boolean;
    isCorrectAnswer: boolean;
  }
  