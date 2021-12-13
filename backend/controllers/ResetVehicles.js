const pool = require('./../config/db');
const csvtojson = require('csvtojson');

module.exports = async (req, res) => {
    try {
        const vehicles = await csvtojson().fromFile(__dirname + '/../default/vehicles.csv');
        const tags = await csvtojson().fromFile(__dirname + '/../default/tags.csv');
        let vehiclesArray = [];
        let tagsArray = [];
        vehicles.forEach((v) => {
            vehiclesArray.push([v.vehicle_id, v.license_year]);
        });
        tags.forEach((t) => {
            tagsArray.push([t.tag_id, t.vehicle_id, t.tag_provider]);
        });

        const connection = await pool.getConnection();
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('DELETE FROM vehicles');
        await connection.query('DELETE FROM tags');
        await connection.query('INSERT INTO vehicles (vehicle_id, license_year) VALUES ?', [vehiclesArray]);
        await connection.query('INSERT INTO tags (tag_id, vehicle_id, tag_provider) VALUES ?', [tagsArray]);
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        connection.release();
        return res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
};
