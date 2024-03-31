import type { RowDataPacket } from 'mysql2';
import QueryUtils from './queryUtils';


export interface IUserRow extends RowDataPacket {
    id: number
    username: string
    email: string
    password: string
    createdAt: Date;
    updatedAt: Date;
}

const getAll = async () => {
    return QueryUtils.SelectQuery<IUserRow>('SELECT * FROM users;');
}

const getOne = async (id: number) => {
    return QueryUtils.SelectQuery<IUserRow>('SELECT * FROM users WHERE id = ?', [id]);
}

const register = async (user: IUserRow): Promise<IUserRow> => {
    const result = await QueryUtils.ModifyQuery<IUserRow>('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [user.username, user.email, user.password]);
    return {
        ...user,
        id: result.insertId
    };
}

const getByEmail = async (user: IUserRow) => {
    return QueryUtils.SelectQuery<IUserRow>('SELECT * FROM users WHERE email = ? AND deletedAt IS NULL', [user.email]);
}

const deleteUser = async (id: number) => {
    return QueryUtils.ModifyQuery<IUserRow>('UPDATE users SET deletedAt = NOW() WHERE id = ?', [id]);
}

const updatePassword = async (data: string, id: number) => {
    return QueryUtils.ModifyQuery<IUserRow>('UPDATE users SET password = ? WHERE id = ?', [data, id]);
}

export default {
    getAll,
    getOne,
    register,
    getByEmail,
    deleteUser,
    updatePassword
}