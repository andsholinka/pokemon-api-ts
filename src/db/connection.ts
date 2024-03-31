import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_CONFIG_HOST || 'localhost',
    user: process.env.MYSQL_CONFIG_USER || 'root',
    password: process.env.MYSQL_CONFIG_PASSWORD || '',
    database: process.env.MYSQL_CONFIG_DATABASE || 'pokemon',
    connectionLimit: 10,
    maxIdle: 10,
});

export default pool;