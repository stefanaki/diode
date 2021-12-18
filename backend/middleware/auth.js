const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis');

module.exports = async (req, res, next) => {
    const token = req.header('X-OBSERVATORY-AUTH');

    if (!token) return res.status(403).json({ message: 'Authentication token required' });

    try {
        let isBlacklisted = await redisClient.lPos('blacklisted_tokens', token);
        if (isBlacklisted)
            return res
                .status(401)
                .json({ message: 'User with specified token has logged out. Please log in.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
    return next();
};
