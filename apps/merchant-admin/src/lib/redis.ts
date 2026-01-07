import Redis from "ioredis";

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    return null;
};

// Singleton pattern to prevent multiple connections in serverless
declare global {
    var redis: Redis | undefined;
}

const redisUrl = getRedisUrl();

export const redis =
    global.redis ||
    (redisUrl ? new Redis(redisUrl) : null);

if (process.env.NODE_ENV !== "production" && redis) {
    global.redis = redis;
}
