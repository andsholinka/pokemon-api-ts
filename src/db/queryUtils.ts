import pool from './connection';
import type { ResultSetHeader } from 'mysql2';

const SelectQuery = async <T>(queryString: string, values?: any[]): Promise<Partial<T>[]> => {
    const [result] = await pool.query(queryString, values);
    return result as T[];
}

const ModifyQuery = async <T>(queryString: string, values?: any[]): Promise<ResultSetHeader> => {
    const [result] = await pool.query(queryString, values);
    return result as ResultSetHeader;
}

export default {
    SelectQuery,
    ModifyQuery
}