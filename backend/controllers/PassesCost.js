const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
    const { op1_ID , op2_ID, date_from, date_to } = req.params;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const dateTimeNow = moment().format(format);
    

    const finalQuery = `
SELECT Count(pass_id) as NumberOfPasses , SUM(pass_charge) as PassesCost
FROM passes p 
INNER JOIN stations s
ON p.station_id = s.st_id AND s.op_name = ?
INNER JOIN tags t
ON t.tag_id = p.tag_id AND tag_provider = ?
WHERE (pass_timestamp
BETWEEN ? AND ?)
ORDER BY p.pass_timestamp ASC;
            `;
 

    try {
        const connection = await pool.getConnection();
        const finalQueryRes = await connection.query(finalQuery, [op1_ID,date_from,date_to]);

        if (!finalQueryRes[0][0]) {
            return sendResponse(req, res, 400, {
                message: 'Bad request: Invalid op_ID'
            });
        }


        // Parse result as JS object and include PPOList
        let queryResultList = JSON.parse(JSON.stringify(finalQueryRes));
        sendResponse(req, res, 200, {
            op1_ID: op1_ID,
            op2_ID : op2_ID,
            RequestTimestamp: dateTimeNow,
            PeriodFrom: date_from,
            PeriodTo: date_to,
            NumberOfPasses: finalQueryRes[0][0],
            PassesCost: finalQuery[0][1]
        });
    
        connection.release();
       
    } catch {
        sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};
