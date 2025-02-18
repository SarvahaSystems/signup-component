import { NextFunction, Response } from "express";
import { getDbInstance } from "../config/db";
import { connectRedis, redisClient } from "../config/redis";
import { requestOtp, verifyOtp } from "../schema/otpSchema";
import { createToken, sendOtpEmail, verifyRecaptcha } from "../service/authService";
import { EMAIL_SUBJECT, emailText, OTP_VALIDITY } from "../utils/constants";

/**
 * Handles the request to generate and send OTP to the user.
 * @param {requestOtp} req - The request containing the user's name, email and captcha token.
 * @param {Response} res - The response object to send the response.
 * @param {NextFunction} next - The next middleware function to call.
 */
export const generateAndSendOtp = async (req: requestOtp, res: Response, next: NextFunction) => {
    const { name, email, captchaToken } = req.validated.body;

    // Verify the captcha token
    const isCaptchaValid = await verifyRecaptcha(captchaToken);
    if (!isCaptchaValid) {
        const error = new Error("reCAPTCHA validation failed");
        (error as any).status = 400;
        next(error);
        return;
    }

    // Connect to Redis if not already connected
    if (!redisClient.isReady) {
        await connectRedis();
    }

    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set the OTP in Redis with an expiration time
    const expiry = Date.now() + OTP_VALIDITY * 60 * 1000;
    await redisClient.set(email, JSON.stringify({ otp, expiryTime: expiry }));

    // Compose the email
    const subject = EMAIL_SUBJECT;
    const text = emailText(name, otp);

    // Send the email
    const response = await sendOtpEmail(email, subject, text);

    // Return the response
    res.status(200).json({ message: response.message });
};

/**
 * Verifies the user's OTP and returns a token if successful.
 *
 * @param {verifyOtp} req - The request containing user details and OTP.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next middleware function to call in case of errors.
 */
export const verifyUserOtp = async (req: verifyOtp, res: Response, next: NextFunction) => {
    const { user, otp } = req.validated.body;
    const { email } = user;

    // Ensure Redis connection is ready
    if (!redisClient.isReady) {
        await connectRedis();
    }

    // Retrieve the stored OTP data from Redis
    const storedOtpData = await redisClient.get(email);
    if (!storedOtpData) {
        const error = new Error("OTP expired or invalid. Please request a new OTP");
        (error as any).status = 500;
        next(error);
        return;
    }

    const { otp: storedOtp, expiryTime } = JSON.parse(storedOtpData);

    // Check if the OTP has expired
    if (Date.now() > expiryTime) {
        const error = new Error("OTP has expired. Please request a new OTP");
        (error as any).status = 500;
        next(error);
        return;
    }

    // Validate the OTP
    if (otp !== storedOtp) {
        const error = new Error("Invalid OTP. Please try again");
        (error as any).status = 500;
        next(error);
        return;
    }

    // Access the users collection in the database
    const collection = (await getDbInstance()).collection("users");

    // Check if the user already exists in the database
    const userExists = await collection.findOne({ email });

    let token = "";
    if (userExists) {
        // Use existing token if user exists
        token = userExists.token;
    } else {
        // Create a new token and store user data if user does not exist
        token = await createToken(user);
        const userData = {
            name: user.name,
            email: user.email,
            token,
        };
        await collection.insertOne(userData);
    }

    // Send a successful response with the token
    res.status(200).json({ message: "OTP Verified Successfully", token });
};
