const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');
const sendResponse = require('../utilities/sendFormattedResponse');

// Parameterized middleware for identifying admins & other user types
module.exports = (userType) => {
    return async (req, res, next) => {
        const token = req.header('X-OBSERVATORY-AUTH');

        if (!token)
            return sendResponse(req, res, 403, { message: 'Authentication token required' });

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

            if (userType === 'admin' && payload.type !== 'admin') {
                return sendResponse(req, res, 401, {
                    message: 'You need administrator privileges to execute this endpoint'
                });
            }

            if (userType === 'bank' && payload.type !== 'bank') {
                return sendResponse(req, res, 401, {
                    message: 'You need payment service provider privileges to execute this endpoint'
                });
            }
            req.user = payload;
        } catch (error) {
            return sendResponse(req, res, 401, { message: 'Invalid token' });
        }
        return next();
    };
};
