const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const query = 'SELECT st_id, st_name FROM stations WHERE op_name = ?';
	const { operator } = req.params;

	try {
		const connection = await pool.getConnection();
		try {
			let stations = await connection.query(query, [operator]);
			sendResponse(req, res, 200, {
				stations: stations[0]
			});
		} catch (error) {
			console.log(error);
			sendResponse(req, res, 500, { message: 'Internal server error' });
		} finally {
			connection.release();
		}
	} catch (error) {
		sendResponse(req, res, 500, {
			message:
				'Could not connect to the database. Run a connection healthcheck for more information.'
		});
	}
};
