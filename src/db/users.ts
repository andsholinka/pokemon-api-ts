import type { RowDataPacket } from 'mysql2';
import QueryUtils from './queryUtils';

export interface IUserRow extends RowDataPacket {
    id: number
    username: string
    email: string
    password: string
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
    return QueryUtils.SelectQuery<IUserRow>('SELECT * FROM users WHERE email = ?', [user.email]);
}

export default {
    getAll,
    getOne,
    register,
    getByEmail
}