import { useEffect } from "react";
import { archiveService } from "@/lib/archive/archive.service";
import { dexieAuthService } from "@/lib/dexie/auth.service";

const ARCHIVE_CHECK_KEY = "lastArchiveCheck";

export const useAutoArchive = (): void => {
    useEffect(() => {
        const checkAndArchive = async (): Promise<void> => {
            const user = dexieAuthService.getCurrentUser();
            if (!user) {
                return;
            }

            const lastCheck = localStorage.getItem(ARCHIVE_CHECK_KEY);
            const today = new Date().toDateString();

            if (lastCheck === today) {
                return;
            }

            try {
                await archiveService.archivePreviousMonth();
                localStorage.setItem(ARCHIVE_CHECK_KEY, today);
            } catch (error) {
                console.error("Auto-archive failed:", error);
            }
        };

        const timeoutId = setTimeout(() => {
            void checkAndArchive();
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
};
