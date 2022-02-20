const axios = require('axios');
const fs = require('fs');

module.exports = async () => {
	try {
		if (!fs.existsSync('.token')) return console.log('Please log in first.');
		const token = fs.readFileSync('.token', 'utf8');

		if (token.length === 0) return console.log('Please log in first.');

		const healthCheck = await axios({
			url: `${process.env.API_URL}/interoperability/api/admin/healthcheck`,
			method: 'get',
			headers: {
				'X-OBSERVATORY-AUTH': token
			},
			httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
		});

		console.log(
			`Connection status: ${healthCheck.data.status}\nConnection string: ${healthCheck.data.dbconnection}`
		);
	} catch (error) {
		if (error.response && error.response.data && error.response.data.status) {
			console.log(
				`Connection status: ${error.response.data.status}\nConnection string: ${error.response.data.dbconnection}`
			);
			return console.log('Error: ' + error.response.data.error);
		}
		console.log('Could not hit API');
	}
};
