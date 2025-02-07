import { NextFunction, Request, Response } from "express";

/**
 * Error handling middleware to catch and process any errors that occur in the API.
 * @param {unknown} err The error object that was thrown
 * @param {Request} req The Express Request object
 * @param {Response} res The Express Response object
 * @param {NextFunction} next The Express NextFunction
 */
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
    let status = 500;
    let message = "Something went wrong on the server.";
    let stack = "";

    if (err instanceof Error) {
        status = (err as any).status || 500;
        message = err.message;
        stack = err.stack || "";
    }

    res.status(status).json({
        success: false,
        status,
        message,
        stack,
    });

    next();
};
