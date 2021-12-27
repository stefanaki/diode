const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const pool = require('../config/db');
const sendResponse = require('../utilities/sendFormattedResponse');

module.exports = async (req, res, next) => {
    const token = req.header('X-OBSERVATORY-AUTH');

    if (!token) return sendResponse(req, res, 403, { message: 'Authentication token required' });

    try {
        let isBlacklisted = await redisClient.lPos('blacklisted_tokens', token);
        if (isBlacklisted)
            return sendResponse(req, res, 401, {
                message: 'User with specified token has logged out. Please log in.'
            });
    } catch (error) {
        return sendResponse(req, res, 500, { message: 'Internal server error' });
    }

    try {
        const payload = jwt.verify(token, process.env.TOKEN_KEY);
        try {
            const connection = await pool.getConnection();
            const user = await connection.query('SELECT * FROM users WHERE id = ?', [payload.id]);

            if (user[0][0].type !== 'admin') {
                connection.release();
                return sendResponse(req, res, 401, {
                    message: 'You need administrator privileges to execute this endpoint'
                });
            }
            connection.release();
        } catch (error) {
            console.error(error);
            connection.release();
            return sendResponse(req, res, 500, { message: 'Internal server error' });
        }

        req.user = payload;
    } catch (error) {
        return sendResponse(req, res, 401, { message: 'Invalid token' });
    }
    return next();
};
