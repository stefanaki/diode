const pool = require('./../config/db');
const moment = require('moment');

module.exports = async (req, res) => {
    const { stationID, dateFrom, dateTo } = req.params;
    const format = 'YYYY-MM-DD HH:mm:ss';
    const dateTimeNow = moment().format(format);

    if (!moment(dateFrom, format, true).isValid() || !moment(dateFrom, format, true).isValid()) {
        return res.status(400).json({ message: 'Bad request: Invalid date formats' });
    }

    if (moment(dateFrom, format, true).diff(dateTo, format, true) >= 0) {
        return res.status(400).json({
            message: 'Bad request: dateFrom should be smaller than dateTo'
        });
    }

    // Fetch operator name query
    const operatorQuery = `SELECT st_name, op_name FROM stations WHERE st_id = ?`;

    const stationNameQuery = 'SELECT st_name FROM stations WHERE st_id = ?';

    // Fetch Pass List query
    const passesListQuery = `
            SELECT p.pass_id as PassID, p.pass_timestamp as PassTimeStamp,
            t.vehicle_id as VehicleID, t.tag_provider as TagProvider,
            CASE
                WHEN t.tag_provider = ? THEN "home"
                ELSE "away"
            END as PassType,
            p.pass_charge as PassCharge
            FROM passes p JOIN tags t ON (p.tag_id = t.tag_id)
            WHERE p.station_id = ? AND p.pass_timestamp BETWEEN ? AND ?
            ORDER BY p.pass_timestamp ASC`;

    try {
        const connection = await pool.getConnection();
        const operatorQueryRes = await connection.query(operatorQuery, [stationID]);

        if (!operatorQueryRes[0][0]) {
            return res.status(404).json({ message: 'Bad request: Invalid stationID' });
        }

        const operatorID = operatorQueryRes[0][0].op_name;
        const stationName = operatorQueryRes[0][0].st_name;

        let queryResult = await connection.query(passesListQuery, [
            operatorID,
            stationID,
            dateFrom,
            dateTo
        ]);

        // Parse result as JS object, compute total length, append PassIndex field
        let queryResultList = JSON.parse(JSON.stringify(queryResult));
        let i = 0;
        queryResultList[0].forEach((pass) => (pass.PassIndex = ++i));

        res.status(200).json({
            Station: stationName,
            StationOperator: operatorID,
            RequestTimestamp: dateTimeNow,
            PeriodFrom: dateFrom,
            PeriodTo: dateTo,
            NumberOfPasses: i,
            PassesList: queryResultList[0]
        });

        connection.release();
    } catch {
        res.status(500).json({ message: 'Internal server error' });
    }
};
