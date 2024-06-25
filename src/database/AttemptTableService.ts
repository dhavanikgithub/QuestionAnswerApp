import SQLite from 'react-native-sqlite-storage';
import DatabaseService from './DatabaseService';
import { Attempt } from "../model/Attempt";
import { QuestionAttempt } from '../model/QuestionAttempt';
import { User } from '../model/User';


class AttemptTableService {

    constructor(private db: SQLite.SQLiteDatabase) { }

    // Add a new attempt entry
    public async add(attempt: Attempt): Promise<void> {
        await this.db.executeSql(
            `INSERT INTO attempts (userId, questionId, isAttemptQuestion, isCorrectAnswer) VALUES (?, ?, ?, ?)`,
            [attempt.userId, attempt.questionId, attempt.isAttemptQuestion ? 1 : 0, attempt.isCorrectAnswer ? 1 : 0]
        );
    }

    // Update an attempt entry by ID
    public async update(id: number, updatedAttempt: Partial<Attempt>): Promise<void> {
        const currentAttempt = await this.fetch(id);

        if (!currentAttempt) {
            throw new Error('Attempt entry not found');
        }

        const updatedData = {
            ...currentAttempt,
            ...updatedAttempt,
        };

        await this.db.executeSql(
            `UPDATE attempts SET userId = ?, questionId = ?, isAttemptQuestion = ?, isCorrectAnswer = ? WHERE id = ?`,
            [updatedData.userId, updatedData.questionId, updatedData.isAttemptQuestion ? 1 : 0, updatedData.isCorrectAnswer ? 1 : 0, id]
        );
    }

    // Delete an attempt entry by ID
    public async delete(id: number): Promise<void> {
        await this.db.executeSql(`DELETE FROM attempts WHERE id = ?`, [id]);
    }

    public async deleteByUserId(userId: number): Promise<void> {
        await this.db.executeSql(`DELETE FROM attempts WHERE userId = ?`, [userId]);
    }

    // Fetch an attempt entry by ID
    public async fetch(id: number): Promise<Attempt | undefined> {
        const results = await this.db.executeSql(`SELECT * FROM attempts WHERE id = ?`, [id]);

        if (results[0].rows.length > 0) {
            const row = results[0].rows.item(0);
            return {
                id: row.id,
                userId: row.userId,
                questionId: row.questionId,
                isAttemptQuestion: row.isAttemptQuestion === 1,
                isCorrectAnswer: row.isCorrectAnswer === 1,
            };
        }

        return undefined;
    }

    // Fetch all attempt entries
    public async fetchAll(): Promise<Attempt[]> {
        const results = await this.db.executeSql(`SELECT * FROM attempts`);
        const attempts: Attempt[] = [];

        for (let i = 0; i < results[0].rows.length; i++) {
            const row = results[0].rows.item(i);
            attempts.push({
                id: row.id,
                userId: row.userId,
                questionId: row.questionId,
                isAttemptQuestion: row.isAttemptQuestion === 1,
                isCorrectAnswer: row.isCorrectAnswer === 1,
            });
        }

        return attempts;
    }

    public async fetchQuestionAttemptsByUserId(userId: number): Promise<QuestionAttempt[]> {
        if (!this.db) return [];

        const query = `
          SELECT
            q.id as questionId,
            q.question,
            q.options,
            q.correctAnswer,
            a.id as attemptId,
            a.userId,
            a.isAttemptQuestion,
            a.isCorrectAnswer
          FROM
            questions q
          ,
            attempts a
          ON
            q.id = a.questionId
            AND
            a.userId = ?
        `;

        try {
            const results = await this.db.executeSql(query, [userId]);
            const rows = results[0].rows;
            const questionAttempts: QuestionAttempt[] = [];

            for (let i = 0; i < rows.length; i++) {
                const item = rows.item(i);
                questionAttempts.push({
                    questionId: item.questionId,
                    question: item.question,
                    options: item.options,
                    correctAnswer: item.correctAnswer,
                    attemptId: item.attemptId,
                    userId: item.userId,
                    isAttemptQuestion: item.isAttemptQuestion === 1,
                    isCorrectAnswer: item.isCorrectAnswer === 1,
                });
            }

            return questionAttempts;
        } catch (error) {
            console.error('Failed to fetch question attempts:', error);
            return [];
        }
    }
    // Fetch attempt entries by user ID
    public async fetchByUserId(userId: number): Promise<Attempt[]> {
        const results = await this.db.executeSql(`SELECT * FROM attempts WHERE userId = ?`, [userId]);
        const attempts: Attempt[] = [];

        for (let i = 0; i < results[0].rows.length; i++) {
            const row = results[0].rows.item(i);
            attempts.push({
                id: row.id,
                userId: row.userId,
                questionId: row.questionId,
                isAttemptQuestion: row.isAttemptQuestion === 1,
                isCorrectAnswer: row.isCorrectAnswer === 1,
            });
        }

        return attempts;
    }

    public async fetchUserDetailsFromAttempts(): Promise<User[]> {
        if (!this.db) return [];
    
        const query = `
          SELECT 
            u.userId,
            u.profileImage,
            u.imageMIME,
            u.userName,
            u.phoneNo,
            u.password
          FROM 
            User u
          JOIN
            attempts a
          ON 
            u.userId = a.userId
          GROUP BY a.userId;
        `;
    
        try {
            const result = await this.db.executeSql(query);
            const rows = result[0].rows;
            const userDetails:User[] = [];
    
            for (let i = 0; i < rows.length; i++) {
                userDetails.push(rows.item(i));
            }
    
            return userDetails;
        } catch (error) {
            console.error("Failed to retrieve user details from attempts:", error);
            return [];
        }
    }
    
}

export const attemptTableService = AttemptTableService;

export const getAttemptTableService = () => {
    return DatabaseService.getInstance().getDatabase().then((db) => new AttemptTableService(db))
}
