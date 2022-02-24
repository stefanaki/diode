const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const errorHandler = require('../utilities/errorHandler');

module.exports = async ({ verify, settlid, list, create, op1, op2, datefrom, dateto, format }) => {
	if (verify && list && create)
		return console.log('Please select only one of the available commands');

	if (verify && !settlid) return console.log('Settlement ID not specified');

	if (create && !(op1 && op2 && datefrom && dateto))
		return console.log("Please provide both dates and operator ID's");

	if (list && !(datefrom && dateto)) return console.log('Please provide both dates');

	if (list && !format) return console.log('Response format not specified');

	if (list && format !== 'json' && format !== 'csv')
		return console.log('Invalid response format specified');

	try {
		if (!fs.existsSync('.token')) return console.log('Please log in first.');
		const token = fs.readFileSync('.token', 'utf8');
		if (token.length === 0) return console.log('Please log in first.');

		if (verify) {
			const verifySettlement = await axios({
				url: `https://localhost:9103/interoperability/api/settlements/VerifySettlement`,
				method: 'post',
				headers: {
					'X-OBSERVATORY-AUTH': token
				},
				data: new URLSearchParams({ set_id: settlid }),
				httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
			});

			console.log(`Settlement with ID ${settlid} has been marked as completed successfully`);
		}

		if (create) {
			const createSettlement = await axios({
				url: `https://localhost:9103/interoperability/api/settlements/CreateSettlement`,
				method: 'post',
				headers: {
					'X-OBSERVATORY-AUTH': token
				},
				data: new URLSearchParams({
					op1_ID: op1,
					op2_ID: op2,
					date_from: datefrom,
					date_to: dateto
				}),
				httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
			});

			console.log(`Settlement has been created successfully`);
			console.log(
				`Time period: ${createSettlement.data.PeriodFrom} - ${createSettlement.data.PeriodTo}`
			);
			console.log(`Operator credited: ${createSettlement.data.OperatorCredited}`);
			console.log(`Operator debited: ${createSettlement.data.OperatorDebited}`);
			console.log(`Amount: ${createSettlement.data.Amount.toFixed(2)}`);
		}

		if (list) {
			const listSettlements = await axios({
				url: `https://localhost:9103/interoperability/api/settlements/GetSettlements/${datefrom}/${dateto}`,
				method: 'get',
				headers: {
					'X-OBSERVATORY-AUTH': token
				},
				params: { format },
				httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
			});

			const resData =
				format === 'json'
					? JSON.stringify(listSettlements.data, null, 4)
					: listSettlements.data;

			const filename = `settlements_${moment(datefrom, 'YYYYMMDD').format(
				'YYYY-MM-DD'
			)}_${moment(dateto, 'YYYYMMDD').format('YYYY-MM-DD')}.${format}`;
			fs.writeFileSync(filename, resData);
			console.log(`Created data file ${filename}`);
		}
	} catch (error) {
		errorHandler(error, format);
	}
};
