const fs = require('fs').promises;
const csv = require('async-csv');
const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	try {
		const connection = await pool.getConnection();
		try {
			let csvString = await fs.readFile(__dirname + '/../sample_data/vehicles.csv', 'utf-8');
			const vehicles = await csv.parse(csvString);
			csvString = await fs.readFile(__dirname + '/../sample_data/tags.csv', 'utf-8');
			const tags = await csv.parse(csvString);
			vehicles.shift();
			tags.shift();

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

			sendResponse(req, res, 200, { status: 'OK' });
		} catch (error) {
			console.log(error);
			sendResponse(req, res, 500, { status: 'Failed', message: 'Internal server error' });
		} finally {
			connection.release();
		}
	} catch {
		sendResponse(req, res, 500, {
			message:
				'Could not connect to the database. Run a connection healthcheck for more information.'
		});
	}
};
