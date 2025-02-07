import { Request } from "express";
import { z } from "zod";

const requestOtpBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    captchaToken: z.string(),
});

export type RequestOtpBody = z.infer<typeof requestOtpBodySchema>;

export const requestOtpSchema = z.object({
    body: requestOtpBodySchema,
    query: z.object({}),
    params: z.object({}),
});

export type requestOtpType = z.infer<typeof requestOtpSchema>;

export interface requestOtp extends Request {
    validated: requestOtpType;
}

const verifyOtpBodySchema = z.object({
    user: z.object({
        name: z.string(),
        email: z.string().email(),
    }),
    otp: z.string(),
});

export type VerifyOtpBody = z.infer<typeof verifyOtpBodySchema>;

export const verifyOtpSchema = z.object({
    body: verifyOtpBodySchema,
    query: z.object({}),
    params: z.object({}),
});

export type verifyOtpType = z.infer<typeof verifyOtpSchema>;

export interface verifyOtp extends Request {
    validated: verifyOtpType;
}
