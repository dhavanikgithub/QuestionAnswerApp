import SQLite from 'react-native-sqlite-storage';

const database_name = 'QA.db';

// SQLite.DEBUG(true);
SQLite.enablePromise(true);

class DatabaseService {
    private static instance: DatabaseService | null = null;
    private db: SQLite.SQLiteDatabase | null = null;

    private constructor() {
        this.initDatabase();
    } // Private constructor to prevent direct instantiation

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }
    async getDatabase(): Promise<SQLite.SQLiteDatabase> {
        if (this.db) {
            return this.db;
        }
        else {
            await this.initDatabase();
            return this.db!!;
        }
    }

    async initDatabase(): Promise<void> {
        try {
            this.db = await SQLite.openDatabase({
                name: database_name,
                location: 'default',
            });
            await this.createUserTable();
            await this.createQuestionTables();
            await this.createAttemptTables();
        } catch (error) {
            console.error(error);
        }
    }

    private async createUserTable(): Promise<void> {
        if (!this.db) return;
        const query = `
      CREATE TABLE IF NOT EXISTS User (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        profileImage TEXT NOT NULL,
        imageMIME TEXT NOT NULL,
        userName TEXT NOT NULL UNIQUE,
        phoneNo TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `;
        await this.db.executeSql(query);
    }

    private async createQuestionTables() {
        if (!this.db) return;

        await this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            options TEXT NOT NULL,
            correctAnswer TEXT NOT NULL
          );
        `);
    }

    private async createAttemptTables() {
        if (!this.db) return;

        await this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            userId INTEGER NOT NULL,
            questionId INTEGER NOT NULL,
            isAttemptQuestion INTEGER,
            isCorrectAnswer INTEGER
          );
        `);
    }

}

export default DatabaseService;
