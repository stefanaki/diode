const pool = require('./../config/db');

module.exports = async (req, res) => {
    let { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_POOL_SIZE } = process.env;
    let connectionString =
        'mysql;host=' +
        DB_HOST +
        ';db_name=' +
        DB_NAME +
        ';user=' +
        DB_USER +
        ';password=' +
        DB_PASSWORD +
        ';connection_limit=' +
        DB_POOL_SIZE;

    try {
        const connection = await pool.getConnection();
        connection.release();
        res.status(200).json({
            status: 'OK',
            dbconnection: connectionString
        });
    } catch (error) {
        res.status(500).json({
            status: 'Failed',
            dbconnection: connectionString
        });
    }
};
