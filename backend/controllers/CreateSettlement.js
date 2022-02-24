const moment = require('moment');
const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	let { op1_ID, op2_ID, date_from, date_to } = req.body;
	const format = 'YYYY-MM-DD HH:mm:ss';

	if (op1_ID == op2_ID) {
		return sendResponse(req, res, 400, {
			message: `Bad request: The 2 Operators IDs are the same`
		});
	}

	date_from = moment(date_from, 'YYYYMMDD').format(format);
	date_to = moment(date_to, 'YYYYMMDD').subtract(1, 'seconds').format(format);

	const checkQuery = `
        SELECT operator_credited, operator_debited, date_from, date_to 
        FROM settlements 
        WHERE (
         ( (operator_credited = ? AND operator_debited = ?) OR (operator_credited = ? AND operator_debited = ? ) ) 
         AND 
         ( (date_from >= ? AND date_from <= ? ) OR (date_to >= ? AND date_from <= ?) ) 
		 OR(
		 ((operator_credited = ? AND operator_debited = ?) OR (operator_credited = ? AND operator_debited = ? )) 
		 AND
		 (date_from = ? AND date_to = ?)
		 ) 		 
        )`;

	// Compute the amount of the settlement and who is credited and who is debited
	const computequery = `
        SELECT SUM(pass_charge) AS PassesCost
        FROM passes p 
        INNER JOIN stations s
        ON p.station_id = s.st_id AND s.op_name = ?
        INNER JOIN tags t
        ON t.tag_id = p.tag_id AND tag_provider = ?
        WHERE pass_timestamp BETWEEN ? AND ?`;

	const insertquery = `
        INSERT INTO settlements (operator_credited,operator_debited,date_from,date_to,amount,status)
        VALUES (?,?,?,?,?,?)`;

	try {
		const connection = await pool.getConnection();
		try {
			let check = await connection.query(checkQuery, [
				op1_ID,
				op2_ID,
				op2_ID,
				op1_ID,
				date_from,
				date_to,
				date_from,
				date_from,
				op1_ID,
				op2_ID,
				op2_ID,
				op1_ID,
				date_from,
				date_to
			]);

			if (check[0][0]) {
				return sendResponse(req, res, 400, {
					message: 'Bad request: The settlement overlaps with existing settlement'
				});
			}

			let q1 = await connection.query(computequery, [op1_ID, op2_ID, date_from, date_to]); // how much money does op2 owes to op1
			let q2 = await connection.query(computequery, [op2_ID, op1_ID, date_from, date_to]); // how much money does op1 owes to op2

			let pc1 = q1[0][0].PassesCost ? q1[0][0].PassesCost : 0;
			let pc2 = q2[0][0].PassesCost ? q2[0][0].PassesCost : 0;

			let amount = Math.abs(pc2 - pc1);
			let status = 0;

			let credited, debited;
			if (pc1 > pc2) {
				// op1 is credited and op2 is debited
				credited = op1_ID;
				debited = op2_ID;
				await connection.query(insertquery, [
					op1_ID,
					op2_ID,
					date_from,
					date_to,
					amount,
					status
				]);
			}
			if (pc1 < pc2) {
				// op2 is credited and op1 is debited
				credited = op2_ID;
				debited = op1_ID;
				await connection.query(insertquery, [
					op2_ID,
					op1_ID,
					date_from,
					date_to,
					amount,
					status
				]);
			}

			if (pc1 == pc2) {
				return sendResponse(req, res, 400, {
					message: 'The settlement amount is zero'
				});
			}

			sendResponse(req, res, 200, {
				message: 'Settlement has been created successfully',
				PeriodFrom: `${moment(date_from, format).format(format)}`,
				PeriodTo: `${moment(date_to, format).add(1, 'seconds').format(format)}`,
				OperatorCredited: credited,
				OperatorDebited: debited,
				Amount: amount
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
