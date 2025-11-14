import { db } from "@/lib/dexie/dexie.db";
import { dexieAuthService } from "@/lib/dexie/auth.service";
import { exportTasksToExcel, getMonthYearFilename } from "@/utils/excel.utils";
import type { Task } from "@/lib/dexie/types";
import { showToast } from "@/lib/toast";

const getCurrentMonthStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getPreviousMonthStart = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() - 1, 1);
};

const getPreviousMonthEnd = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
};

const isTaskInMonth = (
    task: Task,
    monthStart: Date,
    monthEnd: Date
): boolean => {
    const taskDate = new Date(`${task.date}T${task.time}`);
    return taskDate >= monthStart && taskDate <= monthEnd;
};

const getTasksForMonth = async (
    monthStart: Date,
    monthEnd: Date
): Promise<Task[]> => {
    const allTasks = await db.tasks.toArray();
    return allTasks.filter((task) => isTaskInMonth(task, monthStart, monthEnd));
};

export const archiveService = {
    archivePreviousMonth: async (): Promise<void> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const previousMonthStart = getPreviousMonthStart();
        const previousMonthEnd = getPreviousMonthEnd();
        const currentMonthStart = getCurrentMonthStart();

        const now = new Date();
        if (now.getDate() <= 1) {
            return;
        }

        const tasksToArchive = await getTasksForMonth(
            previousMonthStart,
            previousMonthEnd
        );

        if (tasksToArchive.length === 0) {
            return;
        }

        try {
            const filename = getMonthYearFilename(previousMonthStart);
            exportTasksToExcel(tasksToArchive, filename);

            const taskIds = tasksToArchive
                .map((task) => task.id)
                .filter((id): id is string => id !== undefined);

            await db.tasks.bulkDelete(taskIds);

            showToast.success(
                `Archived ${
                    tasksToArchive.length
                } tasks from ${previousMonthStart.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })}`
            );
        } catch (error) {
            console.error("Error archiving tasks:", error);
            showToast.error("Failed to archive tasks. Please try again.");
            throw error;
        }
    },

    archiveMonth: async (year: number, month: number): Promise<void> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

        const tasksToArchive = await getTasksForMonth(monthStart, monthEnd);

        if (tasksToArchive.length === 0) {
            showToast.info("No tasks found for the selected month.");
            return;
        }

        try {
            const filename = getMonthYearFilename(monthStart);
            exportTasksToExcel(tasksToArchive, filename);

            const taskIds = tasksToArchive
                .map((task) => task.id)
                .filter((id): id is string => id !== undefined);

            await db.tasks.bulkDelete(taskIds);

            showToast.success(
                `Archived ${
                    tasksToArchive.length
                } tasks from ${monthStart.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                })}`
            );
        } catch (error) {
            console.error("Error archiving tasks:", error);
            showToast.error("Failed to archive tasks. Please try again.");
            throw error;
        }
    },

    getArchivableTasks: async (): Promise<Task[]> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const currentMonthStart = getCurrentMonthStart();
        const allTasks = await db.tasks.toArray();

        return allTasks.filter((task) => {
            const taskDate = new Date(`${task.date}T${task.time}`);
            return taskDate < currentMonthStart;
        });
    },
};
