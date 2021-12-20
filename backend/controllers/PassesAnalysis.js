const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
    const { op1_ID, op2_ID, date_from, date_to} = req.params;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const dateTimeNow = moment().format(format);

    if (!moment(date_from, format, true).isValid() || !moment(date_from, format, true).isValid()) {
        return sendResponse(req, res, 400, { message: 'Bad request: Invalid date formats' });
    }

    if (moment(date_from, format, true).diff(date_to, format, true) >= 0) {
        return sendResponse(req, res, 400, {
            message: 'Bad request: dateFrom should be smaller than dateTo'
        });
    }

    // Fetch Pass List query
    const passesListQuery = `
    SELECT 
        p.pass_id as PassID,
        p.station_id as StationID,
        p.pass_timestamp as TimeStamp,
        t.vehicle_id as VehicleId,
        p.pass_charge as Charge
    FROM 
        passes p
    INNER JOIN stations s
        ON p.station_id = s.st_id AND s.op_name = ?
    INNER JOIN tags t
        ON t.tag_id = p.tag_id AND tag_provider = ?
    WHERE (pass_timestamp 
        BETWEEN ? AND ?)
    ORDER BY p.pass_timestamp ASC;`;

    try {
        const connection = await pool.getConnection();

        let queryResult = await connection.query(passesListQuery, [
            op1_ID,
            op2_ID,
            date_from,
            date_to
        ]);
                                           
        // Parse result as JS object, compute total length, append PassIndex field
        let queryResultList = JSON.parse(JSON.stringify(queryResult));
        let i = 0;
        queryResultList[0].forEach((pass) => (pass.PassIndex = ++i));

        sendResponse(req, res, 200, {
            op1_ID : op1_ID, 
            op2_ID : op2_ID, 
            RequestTimestamp : dateTimeNow,
            PeriodFrom : date_from,
            PeriodTo : date_to,
            PassesList: queryResultList[0] 
        });

        connection.release();
    } catch {
        sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};
