import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pokemon',
    connectionLimit: 10,
    maxIdle: 10,
});

export default pool;