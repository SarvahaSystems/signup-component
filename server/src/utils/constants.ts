export const OTP_VALIDITY = 30;
export const EMAIL_SUBJECT = "Confirm Your Email Address";
export const emailText = (name: string, otp: string) => `Dear ${name},\nThank you for signing up with ONDC APIs Demo powered by Sarvaha Systems. To complete your email verification, please use the One-Time Password (OTP) below:
        Your OTP: ${otp} \nThis OTP is valid for 30 minutes. Please do not share this code with anyone. \nWe’re excited to have you on board!\n
        Best regards,\n
        Abhay Gimekar\n
        Sarvaha Systems Pvt Ltd
        `;

export const SENDGRID_USER = process.env.SENDGRID_USER!;
export const SENDGRID_USER_PASSWORD = process.env.SENDGRID_USER_PASS!;
export const FROM_EMAIL = process.env.FROM_EMAIL!;
export const TOKEN_EXPIRY = "5d";
