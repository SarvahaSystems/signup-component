import { Router } from "express";
import { generateAndSendOtp, verifyUserOtp } from "../controller/authController";
import { asyncHandler } from "../utils/common";
import { validateRequest } from "../middleware/validateRequest";
import { requestOtpSchema, verifyOtpSchema } from "../schema/otpSchema";

export const authRouter = Router();

authRouter.post("/otp/request", validateRequest(requestOtpSchema), asyncHandler(generateAndSendOtp));

authRouter.post("/otp/verify", validateRequest(verifyOtpSchema), asyncHandler(verifyUserOtp));
