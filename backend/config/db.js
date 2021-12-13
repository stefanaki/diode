const mysql = require('mysql2');
require('dotenv').config();

// Export MySQL connection pool with 10
// concurrently available connections
module.exports = mysql
    .createPool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectionLimit: process.env.DB_POOL_SIZE,
        host: process.env.HOST,
        database: process.env.DB_NAME
    })
    .promise();
