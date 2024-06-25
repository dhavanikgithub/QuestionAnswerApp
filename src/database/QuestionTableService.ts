import SQLite from 'react-native-sqlite-storage';
import DatabaseService from './DatabaseService';
import { Question } from '../model/Question';

class QuestionTableService {
    constructor(private db: SQLite.SQLiteDatabase) { }

    // Add a new question
    public async add(question: Omit<Question, 'id'>): Promise<void> {
        const options = JSON.stringify(question.options);

        await this.db.executeSql(
            `INSERT INTO questions (question, options, correctAnswer) VALUES (?, ?, ?)`,
            [question.question, options, question.correctAnswer]
        );
    }

    // Fetch a question by ID
    public async fetch(id: number): Promise<Question | undefined> {
        const results = await this.db.executeSql(
            `SELECT * FROM questions WHERE id = ?`,
            [id]
        );

        if (results[0].rows.length > 0) {
            const row = results[0].rows.item(0);
            return {
                id: row.id,
                question: row.question,
                options: JSON.parse(row.options),
                correctAnswer: row.correctAnswer,
            };
        }

        return undefined;
    }

    // Fetch all questions
    public async fetchAll(): Promise<Question[]> {
        const results = await this.db.executeSql(`SELECT * FROM questions`);
        const questions: Question[] = [];

        for (let i = 0; i < results[0].rows.length; i++) {
            const row = results[0].rows.item(i);
            questions.push({
                id: row.id,
                question: row.question,
                options: JSON.parse(row.options),
                correctAnswer: row.correctAnswer,
            });
        }

        return questions;
    }

    // Update a question by ID
    public async update(id: number, updatedQuestion: Partial<Question>): Promise<void> {
        const currentQuestion = await this.fetch(id);

        if (!currentQuestion) {
            throw new Error('Question not found');
        }

        const updatedData = {
            ...currentQuestion,
            ...updatedQuestion,
        };

        const options = JSON.stringify(updatedData.options);

        await this.db.executeSql(
            `UPDATE questions SET question = ?, options = ?, correctAnswer = ? WHERE id = ?`,
            [updatedData.question, options, updatedData.correctAnswer, id]
        );
    }

    // Delete a question by ID
    public async delete(id: number): Promise<void> {
        await this.db.executeSql(`DELETE FROM questions WHERE id = ?`, [id]);
    }
}

export const questionTableService = QuestionTableService;

export const getQuestionTableService = () => {
    return DatabaseService.getInstance().getDatabase().then((db) => new QuestionTableService(db))
}