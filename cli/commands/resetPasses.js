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
        const resetPasses = await axios({
            url: 'https://localhost:9103/interoperability/api/admin/resetpasses',
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

        resData = format === 'json' ? JSON.stringify(resetPasses.data, null, 4) : resetPasses.data;

        fs.writeFileSync(
            `resetpasses_${moment().format('YYYY-MM-DD_HH:mm:ss')}.${format}`,
            resData
        );

        console.log(resetPasses.status, resetPasses.statusText);
    } catch (error) {
        console.log('Something went wrong...');
        console.log(error.response.status, error.response.data);
    }
};
