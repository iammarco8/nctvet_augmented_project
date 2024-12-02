import mysql from 'mysql2';
import dot from 'dotenv'

dot.config({path:"./config.env"})

export const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
}).promise();