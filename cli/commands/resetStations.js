const axios = require('axios');
const fs = require('fs');
const moment = require('moment');

module.exports = async ({ username, passw, format }) => {
    if (!(format === 'json' || format === 'csv'))
        return console.log('Invalid response format specified');

    try {
        const login = await axios({
            url: 'https://localhost:9103/interoperability/api/login',
            method: 'post',
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: new URLSearchParams({ username, password: passw }),
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
        });

        const token = login.data.token;
        const resetStations = await axios({
            url: 'https://localhost:9103/interoperability/api/admin/resetstations',
            method: 'post',
            params: { format },
            headers: {
                'X-OBSERVATORY-AUTH': token
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
        });

        const logout = await axios({
            url: 'https://localhost:9103/interoperability/api/logout',
            method: 'post',
            headers: {
                'X-OBSERVATORY-AUTH': token
            },
            httpsAgent: new require('https').Agent({ rejectUnauthorized: false })
        });

        resData =
            format === 'json' ? JSON.stringify(resetStations.data, null, 4) : resetStations.data;

        fs.writeFileSync(
            `resetstations_${moment().format('YYYY-MM-DD_HH:mm:ss')}.${format}`,
            resData
        );

        console.log(resetStations.status, resetStations.statusText);
    } catch (error) {
        console.log('Something went wrong...');
        console.log(error.response.status, error.response.data);
    }
};
