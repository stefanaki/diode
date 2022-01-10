const pool = require('./../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res) => {
    const query = 'SELECT * FROM operators';

    try {
        const connection = await pool.getConnection();

        let operators = await connection.query(query);
        sendResponse(req, res, 200, {
            operators: operators[0]
        });
        connection.release();
    } catch (error) {
        console.log(error);
        sendResponse(req, res, 500, { message: 'Internal server error' });
    }
};
