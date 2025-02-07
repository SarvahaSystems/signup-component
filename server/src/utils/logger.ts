import fs from "fs";
import path from "path";
import winston from "winston";
import "winston-daily-rotate-file";

winston.addColors({
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
    silly: "magenta",
});

const coloredFormat = winston.format.combine(
    winston.format.colorize({ all: true }), // Add color to the entire message
    winston.format.printf(({ level, message, timestamp, metadata }) => {
        const meta = metadata && Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : "";
        return `${timestamp} [${level}] ${message}${meta}`;
    })
);

const singleLineFormat = winston.format.printf(({ level, message, timestamp, metadata }) => {
    const meta = metadata && Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : "";
    return `${timestamp} [${level.toUpperCase()}] ${message}${meta}`;
});

const createLogDirectory = (): string => {
    const today = new Date().toISOString().split("T")[0];
    const folderName = today.split("-").reverse().join("-");
    const logDir = path.join("logs", folderName);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return logDir;
};

const dailyRotateFileTransport = (level: string, logDir: string) =>
    new winston.transports.DailyRotateFile({
        level,
        filename: path.join(logDir, `${level}.log`),
        datePattern: "DD-MM-YYYY",
        maxSize: "100m",
        maxFiles: "14d",
    });

const logDir = createLogDirectory();

export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: coloredFormat,
        }),
        dailyRotateFileTransport("error", logDir),
        dailyRotateFileTransport("debug", logDir),
        dailyRotateFileTransport("info", logDir),
        dailyRotateFileTransport("warn", logDir),
        dailyRotateFileTransport("silly", logDir),
    ],
    format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.metadata({ fillExcept: ["level", "message", "timestamp"] }), singleLineFormat),
});
