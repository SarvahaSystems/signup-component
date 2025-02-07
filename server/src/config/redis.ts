import { createClient } from "redis";
import { logger } from "../utils/logger";

const redisClient = createClient({ url: "redis://localhost:6379" });

redisClient.on("error", (err: unknown) => {
    if (err instanceof Error) {
        logger.error(`Redis client error: ${err.message}`);
    } else {
        logger.error("Redis client error: Unknown error", err);
    }
});

redisClient.on("connect", () => logger.info("Redis client connected"));

/**
 * Connects to the Redis server.
 * Logs a message upon successful connection, or an error message if the connection fails.
 */
const connectRedis = async () => {
    try {
        await redisClient.connect();
        logger.info("Connected to Redis successfully!");
    } catch (err: unknown) {
        if (err instanceof Error) {
            logger.error(`Failed to connect to Redis: ${err.message}`);
        } else {
            logger.error("Failed to connect to Redis: Unknown error", err);
        }
    }
};

export { connectRedis, redisClient };
