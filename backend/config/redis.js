const redis = require('redis').createClient(process.env.REDIS_PORT);
(async () => {
    try {
        await redis.connect();
    } catch (error) {
        console.error(error);
    }
})();

module.exports = redis;
