const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const { set_id } = req.body;

	const checkQuery = `
        SELECT set_id, status 
        FROM settlements 
        WHERE set_id = ?`;

	// Update the settlement
	const updateSettlement = `
        UPDATE settlements
        SET status = 1 
        WHERE set_id = ?`;

	try {
		const connection = await pool.getConnection();
		try {
			let check = await connection.query(checkQuery, [set_id]);

			if (!check[0][0]) {
				return sendResponse(req, res, 404, {
					message: 'Bad request: The settlement does not exist'
				});
			}
			if (check[0][0].status === 1) {
				return sendResponse(req, res, 400, {
					message: 'Bad request: The settlement has already been completed'
				});
			}

			await connection.query(updateSettlement, [set_id]);

			sendResponse(req, res, 200, {
				message: 'Settlement has been updated successfully!'
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
