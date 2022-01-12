const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const { stationID, date_from, date_to } = req.params;
	const format = 'YYYY-MM-DD HH:mm:ss';
	const dateTimeNow = moment().format(format);

	// Fetch operator name query
	const operatorQuery = `SELECT st_name, op_name FROM stations WHERE st_id = ?`;

	// Fetch Pass List query
	const passesListQuery = `
            SELECT p.pass_id as PassID, p.pass_timestamp as PassTimeStamp,
            t.vehicle_id as VehicleID, t.tag_provider as TagProvider,
            CASE
                WHEN t.tag_provider = ? THEN "home"
                ELSE "away"
            END as PassType,
            p.pass_charge as PassCharge
            FROM passes p JOIN tags t ON (p.tag_id = t.tag_id)
            WHERE p.station_id = ? AND p.pass_timestamp BETWEEN ? AND ?
            ORDER BY p.pass_timestamp ASC`;

	try {
		const connection = await pool.getConnection();
		try {
			const operatorQueryRes = await connection.query(operatorQuery, [stationID]);

			if (!operatorQueryRes[0][0]) {
				return sendResponse(req, res, 400, {
					message: 'Bad request: Invalid stationID'
				});
			}

			const operatorID = operatorQueryRes[0][0].op_name;
			const stationName = operatorQueryRes[0][0].st_name;

			let queryResult = await connection.query(passesListQuery, [
				operatorID,
				stationID,
				date_from,
				date_to
			]);

			if (!queryResult[0][0]) {
				return sendResponse(req, res, 402, {
					message: 'No data for specified station and time period.'
				});
			}

			// Parse result as JS object, compute total length, append PassIndex field
			let queryResultList = JSON.parse(JSON.stringify(queryResult));
			let i = 0;
			queryResultList[0].forEach((pass) => {
				pass.PassIndex = ++i;
				pass.PassTimeStamp = moment(pass.PassTimeStamp).format(format);
				pass.PassCharge = parseFloat(pass.PassCharge);
			});

			sendResponse(req, res, 200, {
				Station: stationName,
				StationOperator: operatorID,
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
