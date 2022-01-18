const { parse } = require('json2csv');

module.exports = (req, res, status, data) => {
	try {
		const format = req.query.format;
		if (!format || format === 'json') return res.status(status).json(data);
		if (format !== 'csv') return res.status(400).json({ message: 'Invalid format option' });

		for (const member of Object.values(data)) {
			if (Array.isArray(member)) {
				let list = parse(member);
				return res.attachment('response_data.csv').send(list);
			}
		}

		let dataArray = parse(data);
		res.attachment('response_data.csv').send(dataArray);
	} catch (error) {
		res.status(500).json({ message: 'Internal server error' });
	}
};
