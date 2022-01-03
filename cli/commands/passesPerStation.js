const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

module.exports = async ({ station, datefrom, dateto, format }) => {
    if (!(format === 'json' || format === 'csv'))
        return console.log('Invalid response format specified');

    try {
        if (!fs.existsSync('.token')) return console.log('Please log in first.');
        const token = fs.readFileSync('.token', 'utf8');

        if (token.length === 0) return console.log('Please log in first.');

        const passesPerStation = await axios({
            url: `https://localhost:9103/interoperability/api/PassesPerStation/${station}/${datefrom}/${dateto}`,
            method: 'get',
            params: { format },
            headers: {
                'X-OBSERVATORY-AUTH': token
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
        });

        const resData =
            format === 'json'
                ? JSON.stringify(passesPerStation.data, null, 4)
                : passesPerStation.data;

        const filename = `passesperstation_${station}_${moment(datefrom, 'YYYYMMDD').format(
            'YYYY-MM-DD'
        )}_${moment(dateto, 'YYYYMMDD').format('YYYY-MM-DD')}.${format}`;
        fs.writeFileSync(filename, resData);
        console.log(`Created data file ${filename}`);
    } catch (error) {
        if (error.response && error.response.status && error.response.data) {
            return console.log(error.response.status, error.response.data);
        }
        console.log('Could not hit API');
    }
};
