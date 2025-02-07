import React, { useEffect } from "react";
import "../css/notification.css";
import { NotificationProps } from "../utils/interfaces";

export const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return <div className="notification">{message}</div>;
};
