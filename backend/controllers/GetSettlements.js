const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
	const { date_from, date_to } = req.params;
	const format = 'YYYY-MM-DD';

	const Query = `
		SELECT set_id AS SettlementID, operator_credited AS OperatorCredited,
		operator_debited AS OperatorDebited, date_from AS DateFrom,
		date_to AS DateTo, amount AS Amount, status AS Status
		FROM settlements 
		WHERE date_from >= ? AND date_to <= ? `;

	try {
		const connection = await pool.getConnection();
		try {
			const QueryRes = await connection.query(Query, [date_from, date_to]);

			if (!QueryRes[0][0]) {
				return sendResponse(req, res, 402, {
					message: 'No data for specified station and time period.'
				});
			}

			let totalsettlements = 0;
			let completed = 0;
			let resultlist = JSON.parse(JSON.stringify(QueryRes[0]));
			resultlist.forEach((settlement) => {
				totalsettlements++;
				completed += settlement.Status == 1 ? 1 : 0;
				settlement.DateFrom = moment(settlement.DateFrom).format(format);
				settlement.DateTo = moment(settlement.DateTo).add(1, 'seconds').format(format);
				settlement.Amount = parseFloat(settlement.Amount);
			});

			sendResponse(req, res, 200, {
				PeriodFrom: moment(date_from).format(format),
				PeriodTo: moment(date_to).format(format),
				TotalSettlements: totalsettlements,
				CompletedSettlements: completed,
				PendingSettlements: totalsettlements - completed,
				SettlementsList: resultlist
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
