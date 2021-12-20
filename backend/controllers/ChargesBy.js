const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
    const { op_ID, date_from, date_to } = req.params;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const dateTimeNow = moment().format(format);
    

    const finalQuery = `
    SELECT D.VisitingOperator,Count(*) AS NumberOfPasses,Sum(D.charge) AS PassesCost 
    FROM (SELECT 
           s.op_name AS op_ID,
           t.tag_provider AS VisitingOperator,
           p.pass_charge AS charge
       FROM passes p
           INNER JOIN tags t
           ON t.tag_id = p.tag_id
           INNER JOIN stations s
           ON s.st_id = p.station_id
       WHERE 
           s.op_name = ?
       AND 
           s.op_name != tag_provider
       AND 
           (pass_timestamp 
           BETWEEN ? AND ?)
        ) AS D 
    GROUP BY D.VisitingOperator
            `;
 

    try {
        const connection = await pool.getConnection();
        const finalQueryRes = await connection.query(finalQuery, [op_ID,date_from,date_to]);

        if (!finalQueryRes[0][0]) {
            return sendResponse(req, res, 400, {
                message: 'Bad request: Invalid op_ID'
            });
        }


        // Parse result as JS object and include PPOList
        let queryResultList = JSON.parse(JSON.stringify(finalQueryRes));
        sendResponse(req, res, 200, {
            op_ID: op_ID,
            RequestTimestamp: dateTimeNow,
            PeriodFrom: date_from,
            PeriodTo: date_to,
            PPOList: queryResultList[0]
        });
    
        connection.release();
       
    } catch() {
        sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};
