const fs = require('fs').promises;
const csv = require('async-csv');
const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	try {
		const connection = await pool.getConnection();
		try {
			const csvString = await fs.readFile(
				__dirname + '/../sample_data/stations.csv',
				'utf-8'
			);
			const data = await csv.parse(csvString);
			data.shift();

			// await connection.query('SET FOREIGN_KEY_CHECKS = 0');
			await connection.query('DELETE FROM stations');
			await connection.query('INSERT INTO stations (st_id, op_name, st_name) VALUES ?', [
				data
			]);
			// await connection.query('SET FOREIGN_KEY_CHECKS = 1');

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
