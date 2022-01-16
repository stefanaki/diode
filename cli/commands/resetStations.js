const axios = require('axios');
const fs = require('fs');

module.exports = async () => {
	try {
		if (!fs.existsSync('.token')) return console.log('Please log in first.');
		const token = fs.readFileSync('.token', 'utf8');

		if (token.length === 0) return console.log('Please log in first.');

		const resetStations = await axios({
			url: 'https://localhost:9103/interoperability/api/admin/resetstations',
			method: 'post',
			headers: {
				'X-OBSERVATORY-AUTH': token
			},
			httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
		});

		console.log(resetStations.data.status);
	} catch (error) {
		if (error.response && error.response.data && error.response.data.status) {
			return console.log(error.response.data.status);
		}
		console.log('Make sure you have deleted all pass events from the database');
	}
};
