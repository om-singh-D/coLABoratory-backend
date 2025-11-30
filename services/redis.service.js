import 'dotenv/config';
import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        if (times > 3) {
            console.log('Redis connection failed after 3 retries');
            return null;
        }
        return Math.min(times * 200, 2000);
    }
});

redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
    console.log('Redis connection error:', err.message);
});

export default redisClient;