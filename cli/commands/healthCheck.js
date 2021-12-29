const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

module.exports = async ({ format }) => {
    if (!(format === 'json' || format === 'csv'))
        return console.log('Invalid response format specified');

    try {
        if (!fs.existsSync('.token')) return console.log('Please log in first.');
        const token = fs.readFileSync('.token', 'utf8');

        if (token.length === 0) return console.log('Please log in first.');

        const healthCheck = await axios({
            url: 'https://localhost:9103/interoperability/api/admin/healthcheck',
            method: 'get',
            params: { format },
            headers: {
                'X-OBSERVATORY-AUTH': token
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
        });

        console.log(healthCheck.data);

        const resData =
            format === 'json' ? JSON.stringify(healthCheck.data, null, 4) : healthCheck.data;

        const filename = `healthcheck_${moment().format('YYYY-MM-DD_HH:mm:ss')}.${format}`;
        fs.writeFileSync(filename, resData);
        console.log(`Created data file ${filename}`);
    } catch (error) {
        console.log('Something went wrong...');
        console.log(error.response.status, error.response.data);
    }
};
