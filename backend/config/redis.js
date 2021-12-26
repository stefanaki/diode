const redis = require('redis').createClient(process.env.REDIS_PORT);
(async () => {
    try {
        await redis.connect();
        console.log(`Connected to Redis server on port ${process.env.REDIS_PORT}`);
    } catch (error) {
        console.error(error);
    }
})();

module.exports = redis;
