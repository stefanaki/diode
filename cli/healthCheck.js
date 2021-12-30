const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

module.exports = async () => {
    try {
        if (!fs.existsSync('.token')) return console.log('Please log in first.');
        const token = fs.readFileSync('.token', 'utf8');

        if (token.length === 0) return console.log('Please log in first.');

        const healthCheck = await axios({
            url: 'https://localhost:9103/interoperability/api/admin/healthcheck',
            method: 'get',
            headers: {
                'X-OBSERVATORY-AUTH': token
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
        });

        console.log(healthCheck.data);
    } catch (error) {
        console.log('Something went wrong...');
        console.log(error.response.status, error.response.data);
    }
};
