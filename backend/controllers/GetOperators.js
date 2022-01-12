const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const query = 'SELECT * FROM operators';

	try {
		const connection = await pool.getConnection();
		try {
			let operators = await connection.query(query);
			sendResponse(req, res, 200, {
				operators: operators[0]
			});
		} catch (error) {
			console.log(error);
			sendResponse(req, res, 500, { message: 'Internal server error' });
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
