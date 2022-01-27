const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const { op_ID, date_from, date_to } = req.params;
	const format = 'YYYY-MM-DD HH:mm:ss';
	const dateTimeNow = req.dateTimeNow;

	const query = `
        SELECT D.VisitingOperator, count(*) AS NumberOfPasses, sum(D.charge) AS PassesCost 
        FROM (
            SELECT 
                s.op_name AS op_ID,
                t.tag_provider AS VisitingOperator,
                p.pass_charge AS charge
            FROM passes p
                INNER JOIN tags t
                ON t.tag_id = p.tag_id
                INNER JOIN stations s
                ON s.st_id = p.station_id
            WHERE 
                s.op_name = ?
            AND 
                s.op_name != tag_provider
            AND 
                pass_timestamp BETWEEN ? AND ?
        ) AS D 
        GROUP BY D.VisitingOperator
        ORDER BY D.VisitingOperator`;

	try {
		const connection = await pool.getConnection();
		try {
			let checkOperator = await connection.query(
				'SELECT op_name FROM operators WHERE op_name = ?',
				[op_ID]
			);

			if (!checkOperator[0][0]) {
				return sendResponse(req, res, 400, {
					message: 'Bad request: Invalid Operator ID'
				});
			}

			let operators = await connection.query('SELECT * FROM operators WHERE op_name != ?', [
				op_ID
			]);
			let opNames = operators[0].map((op) => op.op_name);

			const queryRes = await connection.query(query, [op_ID, date_from, date_to]);

			let PPOList = JSON.parse(JSON.stringify(queryRes[0]));
			PPOList.forEach((op) => {
				op.PassesCost = parseFloat(op.PassesCost);
			});

			for (op in opNames) {
				let found = false;
				for (ppo in PPOList) {
					if (PPOList[ppo].VisitingOperator === opNames[op]) {
						found = true;
					}
				}
				if (!found) {
					PPOList.push({
						VisitingOperator: opNames[op],
						NumberOfPasses: 0,
						PassesCost: 0
					});
				}
			}

			PPOList.sort((a, b) => (a.VisitingOperator > b.VisitingOperator ? 1 : -1));

			sendResponse(req, res, 200, {
				op_ID: op_ID,
				RequestTimestamp: dateTimeNow,
				PeriodFrom: moment(date_from).format(format),
				PeriodTo: moment(date_to).format(format),
				PPOList
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
