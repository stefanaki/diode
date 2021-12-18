//const csv = require('csv-express');
const { parse } = require('json2csv');

module.exports = (req, res, status, data) => {
    try {
        const format = req.query.format;
        console.log(format);
        if (!format || format === 'json') return res.status(status).json(data);
        if (format !== 'csv') return res.status(400).json({ message: 'Invalid format option' });

        let dataArray = parse(data);
        return res.attachment('response_data.csv').send(dataArray);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
