const axios = require('axios');
const fs = require('fs');
const errorHandler = require('../utilities/errorHandler');

module.exports = async ({ username, passw }) => {
	try {
		const login = await axios({
			url: `https://localhost:9103/interoperability/api/login`,
			method: 'post',
			headers: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			data: new URLSearchParams({ username, password: passw }),
			httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
		});

		const token = login.data.token;

		fs.writeFileSync('.token', token);
		console.log(`Welcome, ${username}. Type se2108 --help to display available commands.`);
	} catch (error) {
		errorHandler(error, null);
	}
};
