const redis = require('redis').createClient({
	url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

(async () => {
	try {
		await redis.connect();
		console.log(`Connected to Redis server on port ${process.env.REDIS_PORT}`);
	} catch (error) {
		console.error(error);
	}
})();

module.exports = redis;
