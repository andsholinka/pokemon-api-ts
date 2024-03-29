import mysql from 'mysql2/promise';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pokemon',
    connectionLimit: 10,
    maxIdle: 10,
})

interface IPokemonRow extends RowDataPacket {
    id: number
    pokemon_name: string
    nickname: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

interface IUserRow extends RowDataPacket {
    id: number
    username: string
    email: string
    password: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
}

interface IDetailUserRow extends RowDataPacket {
    id: number
    age: number
    gender: string
    created_at: Date
    updated_at: Date
    deleted_at: Date | null
    user_id: number
}

type IDetailUserJoin = IUserRow & IDetailUserRow;

async function SelectQuery<T>(queryString: string): Promise<Partial<T>[]> {
    const [result] = await pool.query(queryString);
    return result as T[];
}

async function ModifyQuery<T>(queryString: string): Promise<ResultSetHeader> {
    const [result] = await pool.query(queryString);
    return result as ResultSetHeader;
}

// select
SelectQuery<IPokemonRow>('SELECT * FROM my_pokemon_lists')
    .then(result => console.log(result))
    .catch(err => console.log(err));

// insert/update/delete
ModifyQuery('UPDATE my_pokemon_lists SET pokemon_name = "Pikachu New" WHERE id = 1;')
    .then(result => console.log(result))
    .catch(err => console.log(err));

