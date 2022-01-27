const csv = require('async-csv');

module.exports = async (error, format) => {
	if (error.response && error.response.data) {
		if (error.response.data.message) return console.log(error.response.data.message);
		else if (format === 'csv') {
			let msg = await csv.parse(error.response.data);
			return console.log(msg[1][0]);
		}
	}
	console.log('Could not hit API');
};
