const redis = require('redis').createClient(process.env.REDIS_PORT);
(async () => await redis.connect())();

module.exports = redis;
