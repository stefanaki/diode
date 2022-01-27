const { parse } = require('json2csv');

module.exports = (req, res, status, data) => {
	try {
		const format = req.query.format;
		if (!format || format === 'json') return res.status(status).json(data);
		if (format !== 'csv') return res.status(400).json({ message: 'Invalid format option' });

		for (member of Object.values(data)) {
			if (Array.isArray(member)) {
				for (const [key, value] of Object.entries(data)) {
					if (!Array.isArray(value)) {
						member.forEach((li) => Object.assign(li, { [key]: value }));
					}
				}

				return res.status(status).attachment('response_data.csv').send(parse(member));
			}
		}

		res.status(status).attachment('response_data.csv').send(parse(data));
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Internal server error' });
	}
};
