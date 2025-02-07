import axios from "axios";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { FROM_EMAIL, SENDGRID_USER, SENDGRID_USER_PASSWORD, TOKEN_EXPIRY } from "../utils/constants";
import { logger } from "../utils/logger";

/**
 * Verifies the reCAPTCHA token.
 * @param {string} token The reCAPTCHA token
 * @returns {Promise<boolean>} A boolean indicating if the reCAPTCHA was verified successfully
 */
export const verifyRecaptcha = async (token: string): Promise<boolean> => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY!;

    const response = await axios.post(
        "https://www.google.com/recaptcha/api/siteverify",
        new URLSearchParams({
            secret: secretKey,
            response: token,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    const { data } = response;

    if (data.success) {
        logger.info("reCAPTCHA validated successfully!");
        return true;
    }

    logger.error("reCAPTCHA validation failed:");
    return false;
};

/**
 * Sends an OTP to the user's email address.
 * @param {string} email The user's email address
 * @param {string} subject The subject of the email
 * @param {string} text The text of the email
 * @returns {Promise<{ message: string }>} A promise that resolves to an object with a message.
 */
export const sendOtpEmail = async (email: string, subject: string, text: string): Promise<{ message: string }> => {
    const auth = {
        user: SENDGRID_USER,
        pass: SENDGRID_USER_PASSWORD,
    };

    const transporter = nodemailer.createTransport({
        service: "SendGrid",
        auth,
    });

    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);

    return {
        message: "OTP sent to your email. Please verify.",
    };
};

/**
 * Creates a JSON Web Token (JWT) for the given user.
 * @param {Object} user The user details to encode in the JWT
 * @param {string} user.name The user's name
 * @param {string} user.email The user's email address
 * @returns {Promise<string>} A promise that resolves to a JWT in the format "Bearer <token>"
 */
export const createToken = async (user: { name: string; email: string }): Promise<string> => {
    const { name, email } = user;
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET as string, {
        expiresIn: TOKEN_EXPIRY,
    });

    return `Bearer ${token}`;
};
