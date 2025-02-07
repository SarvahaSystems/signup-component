import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import { SITE_KEY } from "../utils/constants";
import { Notification } from "./Notification";
import { Errors, FormData } from "../utils/interfaces";

const Signup: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
    });

    const [errors, setErrors] = useState<Errors>({
        name: "",
        email: "",
        otp: "",
        captcha: "",
    });

    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [otp, setOtp] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
        setErrors({ ...errors, captcha: "" });
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);
        setErrors({ ...errors, otp: "" });
    };

    const validateFields = () => {
        const newErrors: Errors = {
            name: "",
            email: "",
            otp: "",
            captcha: "",
        };
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }
        if (!captchaToken) {
            newErrors.captcha = "Please complete the CAPTCHA";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async () => {
        try {
            if (!validateFields()) {
                const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL!;
                const url = `${baseUrl}/otp/request`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...formData, captchaToken }),
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong.");
                }

                setNotification(data.message);
                setIsOtpSent(true);
            }
        } catch (error: unknown) {
            console.log(formData);

            if (error instanceof Error) {
                console.error("Error during signup:", error.message);
            } else {
                console.error("An unknown error occurred:", error);
            }
        }
    };

    const handleVerifyOtp = async () => {
        try {
            const baseUrl = process.env.REACT_APP_BACKEND_BASE_URL!;
            const url = `${baseUrl}/otp/verify`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: formData, otp }),
            });

            const data = await response.json();
            if (!response.ok) {
                if (data.message === "OTP expired or invalid. Please request a new OTP") {
                    setErrors({ ...errors, otp: "OTP expired or invalid. Please request a new OTP" });
                } else if (data.message === "Invalid OTP. Please try again") {
                    setErrors({ ...errors, otp: "Invalid OTP. Please try again." });
                } else if (data.message === "OTP has expired. Please request a new OTP") {
                    setErrors({ ...errors, otp: "OTP has expired. Please request a new OTP" });
                }
                throw new Error(data.message || "Something went wrong.");
            }

            localStorage.setItem("token", data.token);
            navigate("/home");
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error during signup:", error.message);
            } else {
                console.error("An unknown error occurred:", error);
            }
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, width: 400, textAlign: "center" }}>
                <Typography variant="h4" gutterBottom>
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        mt: 2,
                    }}
                >
                    <TextField fullWidth label="Name" variant="outlined" margin="normal" name="name" value={formData.name} onChange={handleInputChange} error={!!errors.name} helperText={errors.name} required />
                    <TextField fullWidth label="Email" variant="outlined" margin="normal" name="email" value={formData.email} onChange={handleInputChange} error={!!errors.email} helperText={errors.email} required />

                    <ReCAPTCHA
                        sitekey={SITE_KEY} // Replace with your reCAPTCHA site key
                        onChange={handleCaptchaChange}
                    />
                    {errors.captcha && (
                        <Typography color="error" variant="body2">
                            {errors.captcha}
                        </Typography>
                    )}

                    {notification && <Notification message={notification} onClose={() => setNotification(null)} />}

                    {!isOtpSent ? (
                        <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleSignup}>
                            Sign Up
                        </Button>
                    ) : (
                        <>
                            <TextField fullWidth label="OTP" variant="outlined" margin="normal" value={otp} onChange={handleOtpChange} error={!!errors.otp} helperText={errors.otp} required />
                            <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleVerifyOtp}>
                                Verify OTP
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default Signup;
