export interface FormData {
    name: string;
    email: string;
}

export interface Errors {
    name: string;
    email: string;
    otp: string;
    captcha: string;
}

export interface NotificationProps {
    message: string;
    onClose: () => void;
}
