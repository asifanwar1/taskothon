import { db } from "../dexie/dexie.db";
import { dexieAuthService } from "../dexie/auth.service";
import type { Task } from "../dexie/types";
import type {
    TaskStatus,
    DateRange,
    CreateTaskInput,
    UpdateTaskInput,
} from "./types";

const filterByStatus = (tasks: Task[], status: TaskStatus | "all"): Task[] => {
    if (status === "all") {
        return tasks;
    }
    return tasks.filter((task) => task.status === status);
};

const filterByDateRange = (tasks: Task[], dateRange: DateRange): Task[] => {
    if (dateRange === "all") {
        return tasks;
    }

    const now = new Date();
    const cutoffDate = new Date();

    if (dateRange === "week") {
        cutoffDate.setDate(now.getDate() - 7);
    } else if (dateRange === "month") {
        cutoffDate.setMonth(now.getMonth() - 1);
    }

    return tasks.filter((task) => {
        const taskDate = new Date(`${task.date}T${task.time}`);
        return taskDate >= cutoffDate;
    });
};

const sortTasksByDate = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateB - dateA;
    });
};

export const dexieTasksService = {
    getTasks: async (): Promise<Task[]> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const tasks = await db.tasks.toArray();
        return sortTasksByDate(tasks);
    },

    getFilteredTasks: async (
        status?: TaskStatus | "all",
        dateRange?: DateRange
    ): Promise<Task[]> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        let tasks = await db.tasks.toArray();

        if (status) {
            tasks = filterByStatus(tasks, status);
        }

        if (dateRange) {
            tasks = filterByDateRange(tasks, dateRange);
        }

        return sortTasksByDate(tasks);
    },

    getTaskById: async (taskId: string): Promise<Task | undefined> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        return db.tasks.get(taskId);
    },

    createTask: async (taskData: CreateTaskInput): Promise<Task> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const id = await db.tasks.add(taskData as Task);
        const createdTask = await db.tasks.get(id);

        if (!createdTask) {
            throw new Error("Failed to create task");
        }

        return createdTask;
    },

    updateTask: async (
        taskId: string,
        updates: UpdateTaskInput
    ): Promise<void> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const existingTask = await db.tasks.get(taskId);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        await db.tasks.update(taskId, updates);
    },

    deleteTask: async (taskId: string): Promise<void> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        await db.tasks.delete(taskId);
    },

    getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const tasks = await db.tasks.where("status").equals(status).toArray();
        return sortTasksByDate(tasks);
    },

    getTasksByCategory: async (category: string): Promise<Task[]> => {
        const user = dexieAuthService.getCurrentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const tasks = await db.tasks
            .where("category")
            .equals(category)
            .toArray();
        return sortTasksByDate(tasks);
    },
};
