import type { RowDataPacket } from 'mysql2';
import { SelectQuery, ModifyQuery } from './queryUtils';

export interface IUserRow extends RowDataPacket {
    id: number
    username: string
    email: string
    password: string
}

export function getAll() {
    return SelectQuery<IUserRow>('SELECT * FROM users;');
}

export async function getOne(id: number) {
    return SelectQuery<IUserRow>('SELECT * FROM users WHERE id = ?', [id]);
}

export async function register(user: IUserRow) {
    return ModifyQuery<IUserRow>('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [user.username, user.email, user.password]);
}

export async function getByEmail(user: IUserRow) {
    return SelectQuery<IUserRow>('SELECT * FROM users WHERE email = ?', [user.email]);
}