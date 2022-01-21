const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const { op1_ID, op2_ID, date_from, date_to } = req.params;
	const format = 'YYYY-MM-DD HH:mm:ss';
	const dateTimeNow = req.dateTimeNow;

	if (op1_ID == op2_ID) {
		return sendResponse(req, res, 400, {
			message: `Bad request: The 2 Operators IDs are the same`
		});
	}

	const query = `
        SELECT COUNT(pass_id) AS NumberOfPasses, SUM(pass_charge) AS PassesCost
        FROM passes p 
        INNER JOIN stations s
        ON p.station_id = s.st_id AND s.op_name = ?
        INNER JOIN tags t
        ON t.tag_id = p.tag_id AND tag_provider = ?
        WHERE pass_timestamp BETWEEN ? AND ?`;

	try {
		const connection = await pool.getConnection();
		try {
			const queryRes = await connection.query(query, [op1_ID, op2_ID, date_from, date_to]);

			if (!queryRes[0][0]) {
				return sendResponse(req, res, 400, {
					message: 'Bad request: Invalid operator ID'
				});
			}

			sendResponse(req, res, 200, {
				op1_ID: op1_ID,
				op2_ID: op2_ID,
				RequestTimestamp: dateTimeNow,
				PeriodFrom: moment(date_from).format(format),
				PeriodTo: moment(date_to).format(format),
				NumberOfPasses: queryRes[0][0].NumberOfPasses,
				PassesCost: parseFloat(queryRes[0][0].PassesCost)
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
