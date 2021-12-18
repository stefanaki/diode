const fs = require('fs').promises;
const csv = require('async-csv');
const pool = require('./../config/db');

module.exports = async (req, res) => {
    try {
        const csvString = await fs.readFile(__dirname + '/../sample_data/stations.csv', 'utf-8');
        const data = await csv.parse(csvString);
        data.shift();

        const connection = await pool.getConnection();
        // await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DELETE FROM stations');
        await connection.query('INSERT INTO stations (st_id, op_name, st_name) VALUES ?', [data]);
        // await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        connection.release();
        return res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
};
