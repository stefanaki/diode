const pool = require('./../config/db');
const moment = require('moment');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
    const { op_ID, date_from, date_to } = req.params;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const dateTimeNow = moment().format(format);

    const query = `
        SELECT D.VisitingOperator, count(*) AS NumberOfPasses, sum(D.charge) AS PassesCost 
        FROM (
            SELECT 
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
                pass_timestamp BETWEEN ? AND ?
        ) AS D 
        GROUP BY D.VisitingOperator
        ORDER BY D.VisitingOperator`;

    try {
        const connection = await pool.getConnection();
        const queryRes = await connection.query(query, [op_ID, date_from, date_to]);

        if (!queryRes[0][0]) {
            return sendResponse(req, res, 400, {
                message: 'Bad request: Invalid op_ID'
            });
        }

        sendResponse(req, res, 200, {
            op_ID: op_ID,
            RequestTimestamp: dateTimeNow,
            PeriodFrom: date_from,
            PeriodTo: date_to,
            PPOList: queryRes[0]
        });

        connection.release();
    } catch {
        sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};
