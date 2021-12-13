const pool = require('./../config/db');

module.exports = async (req, res) => {
    let { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_POOL_SIZE } = process.env;

    try {
        await pool.getConnection();
        res.status(200).json({
            status: 'OK',
            dbconnection: { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_POOL_SIZE }
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            dbconnection: { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_POOL_SIZE }
        });
    }
};
