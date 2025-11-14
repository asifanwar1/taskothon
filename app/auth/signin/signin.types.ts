import type { DXCUserInteraction } from "dexie-cloud-addon";

export type UseSignInContainerReturn = {
    ui: DXCUserInteraction | undefined;
    params: Record<string, string>;
    isSubmitting: boolean;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    handleCancel: () => void;
    handleFieldChange: (fieldName: string, value: string) => void;
    getTitle: () => string;
    getDescription: () => string;
    resolveText: (alert: import("dexie-cloud-addon").DXCAlert) => string;
};
