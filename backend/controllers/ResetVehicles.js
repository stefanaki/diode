const fs = require('fs').promises;
const csv = require('async-csv');
const pool = require('./../config/db');

module.exports = async (req, res) => {
    try {
        let csvString = await fs.readFile(__dirname + '/../sample_data/vehicles.csv', 'utf-8');
        const vehicles = await csv.parse(csvString);
        csvString = await fs.readFile(__dirname + '/../sample_data/tags.csv', 'utf-8');
        const tags = await csv.parse(csvString);
        vehicles.shift();
        tags.shift();

        const connection = await pool.getConnection();
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DELETE FROM vehicles');
        await connection.query('DELETE FROM tags');
        await connection.query('INSERT INTO vehicles (vehicle_id, license_year) VALUES ?', [
            vehicles
        ]);
        await connection.query('INSERT INTO tags (tag_id, vehicle_id, tag_provider) VALUES ?', [
            tags
        ]);
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        connection.release();
        return res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
};
