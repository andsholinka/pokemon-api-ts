import pool from './connection';
import type { ResultSetHeader } from 'mysql2';

export async function SelectQuery<T>(queryString: string, values?: any[]): Promise<Partial<T>[]> {
    const [result] = await pool.query(queryString, values);
    return result as T[];
}

export async function ModifyQuery<T>(queryString: string, values?: any[]): Promise<ResultSetHeader> {
    const [result] = await pool.query(queryString, values);
    return result as ResultSetHeader;
}