import { useState, useEffect, useRef } from "react";
import { useObservable } from "dexie-react-hooks";
import type { DXCAlert } from "dexie-cloud-addon";
import { db } from "@/lib/dexie/dexie.db";
import { dexieAuthService } from "@/lib/dexie/auth.service";
import type { UseSignInContainerReturn } from "./signin.types";

export const useSigninContainer = (): UseSignInContainerReturn => {
    const ui = useObservable(db.cloud.userInteraction);
    const [params, setParams] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const emailRef = useRef<string>("");

    useEffect(() => {
        dexieAuthService.initiateLogin();
    }, []);

    useEffect(() => {
        if (ui) {
            setParams({});
        }
    }, [ui]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ui?.onSubmit) {
            return;
        }

        if (params.email) {
            emailRef.current = params.email;
        }

        setIsSubmitting(true);
        try {
            await ui.onSubmit(params);
        } catch (error) {
            console.error("Login submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (ui?.onCancel) {
            ui.onCancel();
        }
    };

    const resolveText = (alert: DXCAlert): string => {
        let text = "";

        if ("text" in alert && typeof alert.text === "string") {
            text = alert.text;
        } else if ("code" in alert && typeof alert.code === "string") {
            text = alert.code;
        } else if ("message" in alert && typeof alert.message === "string") {
            text = alert.message;
        }

        if (text && text.includes("{email}")) {
            const email = emailRef.current || params.email || "your email";
            text = text.replace(/{email}/g, email);
        }
        return text;
    };

    const getTitle = (): string => {
        if (!ui) {
            return "Sign In";
        }
        switch (ui.type) {
            case "email":
                return "Sign In";
            case "otp":
                return "Enter Verification Code";
            case "message-alert":
                return ui.title || "Message";
            case "logout-confirmation":
                return "Confirm Logout";
            default:
                return ui.title || "Authentication Required";
        }
    };

    const getDescription = (): string => {
        if (!ui) {
            return "Enter your email to receive a verification code";
        }
        if (ui.type === "email") {
            return "Enter your email address to receive a verification code";
        }
        if (ui.type === "otp") {
            return "Check your email for the verification code";
        }
        if ("description" in ui && typeof ui.description === "string") {
            return ui.description;
        }
        return "";
    };

    const handleFieldChange = (fieldName: string, value: string) => {
        setParams((prev) => ({
            ...prev,
            [fieldName]: value,
        }));
    };

    return {
        ui,
        params,
        isSubmitting,
        handleSubmit,
        handleCancel,
        handleFieldChange,
        getTitle,
        getDescription,
        resolveText,
    };
};
