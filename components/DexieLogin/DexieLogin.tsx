"use client";

import { useState, useEffect } from "react";
import { useObservable } from "dexie-react-hooks";
import { db } from "@/lib/dexie/dexie.db";
import type { DXCAlert, DXCInputField } from "dexie-cloud-addon";
import Modal from "@/components/Modal/Modal";
import { Input } from "@/components/Input";

const resolveText = (alert: DXCAlert): string => {
    if ("text" in alert && typeof alert.text === "string") {
        return alert.text;
    }
    if ("code" in alert && typeof alert.code === "string") {
        return alert.code;
    }
    if ("message" in alert && typeof alert.message === "string") {
        return alert.message;
    }
    return "";
};

export const DexieLogin = () => {
    const ui = useObservable(db.cloud.userInteraction);
    const [params, setParams] = useState<Record<string, string>>({});

    useEffect(() => {
        if (ui) {
            setParams({});
        }
    }, [ui]);

    if (!ui) {
        return null;
    }

    const handleSubmit = async () => {
        if (!ui.onSubmit) {
            return;
        }

        try {
            await ui.onSubmit(params);
        } catch (error) {
            console.error("Login submit error:", error);
        }
    };

    const handleCancel = () => {
        if (ui.onCancel) {
            ui.onCancel();
        }
    };

    const getTitle = (): string => {
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

    return (
        <Modal
            isOpen={true}
            onClose={handleCancel}
            title={getTitle()}
            description={
                ui.type === "email"
                    ? "Enter your email address to receive a verification code"
                    : ui.type === "otp"
                    ? "Check your email for the verification code"
                    : "description" in ui && typeof ui.description === "string"
                    ? ui.description
                    : ""
            }
            size="sm"
            mainContainerClass="bg-white"
            childrenContainerClass="bg-white"
            showCloseButton={!!ui.onCancel}
            primaryButton={
                ui.onSubmit !== undefined && ui.onSubmit !== null
                    ? {
                          label: ui.submitLabel || "Submit",
                          onClick: handleSubmit,
                      }
                    : undefined
            }
            secondaryButton={
                ui.onCancel !== undefined && ui.onCancel !== null
                    ? {
                          label: ui.cancelLabel || "Cancel",
                          onClick: handleCancel,
                      }
                    : undefined
            }
        >
            <div className="space-y-4">
                {ui.alerts?.map((alert, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg text-sm ${
                            alert.type === "error"
                                ? "bg-red-50 text-red-600 border border-red-200"
                                : alert.type === "warning"
                                ? "bg-yellow-50 text-yellow-600 border border-yellow-200"
                                : "bg-blue-50 text-blue-600 border border-blue-200"
                        }`}
                    >
                        {resolveText(alert)}
                    </div>
                ))}

                {Object.entries(ui.fields || {}).map(([fieldName, field]) => {
                    const inputField = field as DXCInputField;
                    return (
                        <Input
                            key={fieldName}
                            label={inputField.label}
                            type={inputField.type || "text"}
                            value={params[fieldName] || ""}
                            onChange={(e) => {
                                setParams((prev) => ({
                                    ...prev,
                                    [fieldName]: e.target.value,
                                }));
                            }}
                            placeholder={inputField.placeholder}
                            fullWidth
                            required
                        />
                    );
                })}
            </div>
        </Modal>
    );
};

export default DexieLogin;
