const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tnccf',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function checkConnection() {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        console.log("Database connected successfully!");
        connection.release();
    } catch (err) {
        console.error("Database connection failed:", err.message);
    }
}

module.exports = { pool, checkConnection };
