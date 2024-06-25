export interface QuestionAttempt {
    questionId: number;
    question: string;
    options: string;
    correctAnswer: string;
    attemptId: number;
    userId: number;
    isAttemptQuestion: boolean;
    isCorrectAnswer: boolean;
}
