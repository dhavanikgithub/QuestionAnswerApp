import { User } from '../model/User';
import SQLite from 'react-native-sqlite-storage';
import BcryptReactNative from 'bcrypt-react-native';
import DatabaseService from './DatabaseService';

class UserService {
    constructor(private db: SQLite.SQLiteDatabase) {
    }

    public async insertUser(user: Omit<User, 'userId'>): Promise<void> {
        if (!this.db) return;
        const salt = await BcryptReactNative.getSalt(10);
        const hashedPassword = await BcryptReactNative.hash(salt, user.password);

        const query = `
          INSERT INTO User (profileImage, imageMIME, userName, phoneNo, password)
          VALUES (?, ?, ?, ?, ?);
        `;
        await this.db.executeSql(query, [
            user.profileImage,
            user.imageMIME,
            user.userName,
            user.phoneNo,
            hashedPassword,
        ]);
    }

    async updateUser(user: User): Promise<void> {
        if (!this.db) return;
        // const salt = await BcryptReactNative.getSalt(10);
        // const hashedPassword = await BcryptReactNative.hash(salt, user.password);

        const query = `
          UPDATE User
          SET profileImage = ?, userName = ?, phoneNo = ?, imageMIME = ?
          WHERE userId = ?;
        `;
        await this.db.executeSql(query, [
            user.profileImage,
            user.userName,
            user.phoneNo,
            user.imageMIME,
            user.userId,
        ]);
    }

    async deleteUser(userId: number): Promise<void> {
        if (!this.db) return;

        const query = `DELETE FROM User WHERE userId = ?;`;
        await this.db.executeSql(query, [userId]);
    }

    async loginUser(userName: string, password: string): Promise<User | null> {
        if (!this.db) return null;

        const query = `SELECT * FROM User WHERE userName = ?;`;
        const result = await this.db.executeSql(query, [userName]);

        if (result[0].rows.length > 0) {
            const user: User = result[0].rows.item(0);
            const isPasswordValid = await BcryptReactNative.compareSync(
                password,
                user.password,
            );
            if (isPasswordValid) {
                return user;
            }
        }
        return null;
    }

    async fetchAllUsers(): Promise<User[]> {
        if (!this.db) return [];

        const query = `SELECT * FROM User;`;
        const result = await this.db.executeSql(query);

        const users: User[] = [];
        for (let i = 0; i < result[0].rows.length; i++) {
            users.push(result[0].rows.item(i));
        }
        return users;
    }

    async fetchUserById(userId: number): Promise<User | null> {
        if (!this.db) return null;

        const query = `SELECT * FROM User WHERE userId = ?;`;
        const result = await this.db.executeSql(query, [userId]);

        if (result[0].rows.length > 0) {
            return result[0].rows.item(0);
        }
        return null;
    }

    async fetchUserByUserName(userName: string): Promise<User | null> {
        if (!this.db) return null;

        const query = `SELECT * FROM User WHERE userName = ?;`;
        const result = await this.db.executeSql(query, [userName]);

        if (result[0].rows.length > 0) {
            return result[0].rows.item(0);
        }
        return null;
    }
}

export default UserService;

export const getUserService = () => {
    return DatabaseService.getInstance().getDatabase().then((db) => new UserService(db))
}

