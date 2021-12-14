const pool = require('./../config/db');
const csvtojson = require('csvtojson');

module.exports = async (req, res) => {
    try {
        const stations = await csvtojson().fromFile(__dirname + '/../sample_data/stations.csv');
        let arr = [];
        stations.forEach((st) => {
            arr.push([st.st_id, st.st_name, st.op_name]);
        });

        const connection = await pool.getConnection();
        await connection.query('DELETE FROM stations');
        await connection.query('INSERT INTO stations (st_id, st_name, op_name) VALUES ?', [arr]);

        connection.release();
        return res.status(200).json({ status: 'OK' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'Failed', message: 'Internal server error' });
    }
};
