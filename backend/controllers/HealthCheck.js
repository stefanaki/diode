const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	let { DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_CONNECTION_LIMIT, DB_PORT } = process.env;
	let connectionString =
		'mysql;host=' +
		DB_HOST +
		';port=' +
		DB_PORT +
		';db_name=' +
		DB_NAME +
		';user=' +
		DB_USER +
		';password=' +
		DB_PASSWORD +
		';connection_limit=' +
		DB_CONNECTION_LIMIT;

	try {
		const connection = await pool.getConnection();
		connection.release();
		sendResponse(req, res, 200, {
			status: 'OK',
			dbconnection: connectionString
		});
	} catch (error) {
		sendResponse(req, res, 500, {
			status: 'Failed',
			dbconnection: connectionString,
			error: error.message
		});
	}
};
