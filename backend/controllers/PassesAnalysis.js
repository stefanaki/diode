const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const { op1_ID, op2_ID, date_from, date_to } = req.params;
	const format = 'YYYY-MM-DD HH:mm:ss';
	const dateTimeNow = moment().format(format);

	if (op1_ID == op2_ID) {
		return sendResponse(req, res, 400, {
			message: `Bad request: The 2 Operators IDs are the same`
		});
	}

	// Check if the op1_ID or op2_ID exist
	const checkOperatorsQuery = `
        SELECT op_name 
        FROM operators 
        WHERE op_name = ? or op_name = ?; `;

	// Fetch Pass List query
	const passesListQuery = `
        SELECT 
            p.pass_id as PassID,
            p.station_id as StationID,
            p.pass_timestamp as TimeStamp,
            t.vehicle_id as VehicleID,
            p.pass_charge as Charge
        FROM 
            passes p
        INNER JOIN stations s
            ON p.station_id = s.st_id AND s.op_name = ?
        INNER JOIN tags t
            ON t.tag_id = p.tag_id AND tag_provider = ?
        WHERE (pass_timestamp 
            BETWEEN ? AND ?)
        ORDER BY p.pass_timestamp ASC;`;

	try {
		const connection = await pool.getConnection();
		try {
			let checkOperatorsResult = await connection.query(checkOperatorsQuery, [
				op1_ID,
				op2_ID
			]);

			if (!checkOperatorsResult[0][0] || !checkOperatorsResult[0][1]) {
				return sendResponse(req, res, 400, {
					message: 'Bad request: Invalid Operator ID'
				});
			}
			let queryResult = await connection.query(passesListQuery, [
				op1_ID,
				op2_ID,
				date_from,
				date_to
			]);

			// Parse result as JS object, compute total length, append PassIndex field
			let queryResultList = JSON.parse(JSON.stringify(queryResult));
			let i = 0;
			queryResultList[0].forEach((pass) => {
				pass.PassIndex = ++i;
				pass.TimeStamp = moment(pass.TimeStamp).format(format);
				pass.Charge = parseFloat(pass.Charge);
			});

			sendResponse(req, res, 200, {
				op1_ID: op1_ID,
				op2_ID: op2_ID,
				RequestTimestamp: dateTimeNow,
				PeriodFrom: moment(date_from).format(format),
				PeriodTo: moment(date_to).format(format),
				NumberOfPasses: i,
				PassesList: queryResultList[0]
			});
		} catch {
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
