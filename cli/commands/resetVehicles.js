const axios = require('axios');
const fs = require('fs');
const errorHandler = require('../utilities/errorHandler');

module.exports = async () => {
	try {
		if (!fs.existsSync('.token')) return console.log('Please log in first.');
		const token = fs.readFileSync('.token', 'utf8');

		if (token.length === 0) return console.log('Please log in first.');

		const resetVehicles = await axios({
			url: `https://localhost:9103/interoperability/api/admin/resetvehicles`,
			method: 'post',
			headers: {
				'X-OBSERVATORY-AUTH': token
			},
			httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
		});

		console.log(resetVehicles.data.status);
	} catch (error) {
		errorHandler(error, null);
		console.log('Make sure you have deleted all pass events from the database');
	}
};
