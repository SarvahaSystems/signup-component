import { Router } from "express";
import { generateAndSendOtp, verifyUserOtp } from "../controller/authController";
import { validateRequest } from "../middleware/validateRequest";
import { requestOtpSchema, verifyOtpSchema } from "../schema/otpSchema";
import { asyncHandler } from "../utils/common";

export const authRouter = Router();

authRouter.post("/otp/request", validateRequest(requestOtpSchema), asyncHandler(generateAndSendOtp));

authRouter.post("/otp/verify", validateRequest(verifyOtpSchema), asyncHandler(verifyUserOtp));
