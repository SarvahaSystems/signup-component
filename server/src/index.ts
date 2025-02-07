import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectToDb } from "./config/db";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./middleware/errorMiddleware";
import { authRouter } from "./routes/authRouter";
import { logger } from "./utils/logger";

const app = express();
app.use(express.json());
app.use(cors());

/**
 * Start the server by connecting to the database and Redis,
 * setting up the routes and error handlers, and listening on the specified port.
 */
const startSever = async (): Promise<void> => {
    await connectToDb();
    await connectRedis();

    app.use(authRouter);
    app.use(errorHandler);

    app.listen(process.env.PORT || 3001, () => {
        logger.info(`Server is listening on port ${process.env.PORT}`);
    });
};

startSever();
