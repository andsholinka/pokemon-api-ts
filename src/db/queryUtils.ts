import pool from './connection';
import type { ResultSetHeader } from 'mysql2';

const startTransaction = async () => {
    await pool.query('START TRANSACTION');
}

const commitTransaction = async () => {
    await pool.query('COMMIT');
}

const rollbackTransaction = async () => {
    await pool.query('ROLLBACK');
}

const SelectQuery = async <T>(queryString: string, values?: any[]): Promise<Partial<T>[]> => {
    const [result] = await pool.query(queryString, values);
    return result as T[];
}

const ModifyQuery = async <T>(queryString: string, values?: any[]): Promise<ResultSetHeader> => {
    const [result] = await pool.query(queryString, values);
    return result as ResultSetHeader;
}

export default {
    startTransaction,
    commitTransaction,
    rollbackTransaction,
    SelectQuery,
    ModifyQuery
}