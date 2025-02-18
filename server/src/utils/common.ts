import { NextFunction, Request, Response } from "express";

/**
 * Wraps an asynchronous function to handle any errors that occur during its execution.
 * @param {Function} fn - The asynchronous function to wrap.
 * @returns A middleware function that executes the asynchronous function and catches any errors.
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
