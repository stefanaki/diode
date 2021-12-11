const funcs = require('./../utilities/functions');
const pool = require('./../config/db');

module.exports = async (req, res) => {
    const { stationID } = req.params;
    const { date_from } = req.params;
    const { date_to } = req.params;
    const datetimeNow = funcs.getRequestTimestamp();

    // Fetch operator name query
    const operatorQuery = `SELECT op_name FROM stations WHERE st_id = ?`;

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
        const operatorQueryRes = await connection.query(operatorQuery, [
            stationID
        ]);
        const operatorID = operatorQueryRes[0][0].op_name;

        let queryResult = await connection.query(passesListQuery, [
            operatorID,
            stationID,
            date_from,
            date_to
        ]);

        // Parse result as JS object, compute total length, append PassIndex field
        let queryResultList = JSON.parse(JSON.stringify(queryResult));
        let i = 0;
        queryResultList[0].forEach((pass) => (pass.PassIndex = ++i));

        res.status(200).json({
            Station: stationID,
            StationOperator: operatorID,
            RequestTimestamp: datetimeNow,
            PeriodFrom: date_from,
            PeriodTo: date_to,
            NumberOfPasses: i,
            PassesList: queryResultList[0]
        });
    } catch {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
