const axios = require('axios');
const fs = require('fs');
const moment = require('moment');
const errorHandler = require('../utilities/errorHandler');

module.exports = async ({ op1, datefrom, dateto, format }) => {
	if (!(format === 'json' || format === 'csv'))
		return console.log('Invalid response format specified');

	try {
		if (!fs.existsSync('.token')) return console.log('Please log in first.');
		const token = fs.readFileSync('.token', 'utf8');

		if (token.length === 0) return console.log('Please log in first.');

		const chargesBy = await axios({
			url: `https://localhost:9103/interoperability/api/ChargesBy/${op1}/${datefrom}/${dateto}`,
			method: 'get',
			params: { format },
			headers: {
				'X-OBSERVATORY-AUTH': token
			},
			httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
		});

		const resData =
			format === 'json' ? JSON.stringify(chargesBy.data, null, 4) : chargesBy.data;

		const filename = `chargesby_${op1}_${moment(datefrom, 'YYYYMMDD').format(
			'YYYY-MM-DD'
		)}_${moment(dateto, 'YYYYMMDD').format('YYYY-MM-DD')}.${format}`;
		fs.writeFileSync(filename, resData);
		console.log(`Created data file ${filename}`);
	} catch (error) {
		errorHandler(error, format);
	}
};
