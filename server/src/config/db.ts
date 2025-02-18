import { Db, MongoClient } from "mongodb";
import { logger } from "../utils/logger";

const url = process.env.DB_CONNECTION_URL!;
const dbName = process.env.DB_NAME!;
let db: Db;

/**
 * Connects to the MongoDB database and returns the database instance.
 * @returns {Promise<Db>} The connected database instance.
 */
export const connectToDb = async (): Promise<Db> => {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        logger.info(`Connected to database: ${dbName}`);
        return db;
    } catch (error) {
        logger.error(`Error connecting to database: ${(error as Error).message}`);
        throw error;
    }
};

/**
 * Returns the connected database instance.
 * If the database instance does not exist, it connects to the database and returns the instance.
 * @returns {Promise<Db>} The connected database instance.
 */
export const getDbInstance = async (): Promise<Db> => {
    try {
        if (!db) {
            db = await connectToDb();
        }
        return db;
    } catch (error) {
        logger.error(`Error connecting to database: ${(error as Error).message}`);
        throw error;
    }
};
