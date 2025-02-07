import { NextFunction, Request, Response } from "express";
import { z } from "zod";

/**
 * A middleware to validate the request body/query/params against a provided schema
 * @param {z.ZodObject<any>} schema The schema to validate against
 */
// eslint-disable-next-line consistent-return
export const validateRequest =
    (schema: z.ZodObject<any>) =>
    (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req);
        if (!result.success) {
            const errors = result.error.issues;
            const errorMessages = errors.map((error) => JSON.stringify(error));
            const error = new Error(errorMessages.join(", "));
            (error as any).status = 400;
            next(error);
            return;
        }

        const validatedData = {
            body: result?.data?.body,
            query: result?.data?.query,
            params: result?.data?.params,
        };

        (req as unknown as { validated: unknown }).validated = validatedData;

        next();
    };
