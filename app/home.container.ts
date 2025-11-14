import { useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import { liveQuery } from "dexie";
import { db } from "@/lib/dexie/dexie.db";
import { dexieAuthService } from "@/lib/dexie/auth.service";
import { useAuth } from "@/hooks/useAuth";
import type { Task } from "@/lib/dexie/types";
import type {
    UseHomeContainerReturn,
    ChartDataPoint,
    PieChartDataPoint,
} from "./home.types";

const sortTasksByDate = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`).getTime();
        const dateB = new Date(`${b.date}T${b.time}`).getTime();
        return dateB - dateA;
    });
};

const EMPTY_TASKS_ARRAY: Task[] = [];

let tasksCache: Task[] = EMPTY_TASKS_ARRAY;
let tasksLoaded = false;
let tasksListeners = new Set<() => void>();
let loadingListeners = new Set<() => void>();
let observableInstance: ReturnType<typeof liveQuery<Task[]>> | null = null;

const getOrCreateObservable = () => {
    if (!observableInstance) {
        observableInstance = liveQuery(async () => {
            const user = dexieAuthService.getCurrentUser();
            if (!user) {
                tasksLoaded = true;
                return EMPTY_TASKS_ARRAY;
            }

            try {
                const tasks = await db.tasks.toArray();
                return sortTasksByDate(tasks);
            } catch (error) {
                console.error("Error loading tasks:", error);
                tasksLoaded = true;
                return EMPTY_TASKS_ARRAY;
            }
        });
    }
    return observableInstance;
};

const subscribeToTasks = (callback: () => void): (() => void) => {
    tasksListeners.add(callback);

    const observable = getOrCreateObservable();

    const subscription = observable.subscribe((tasks) => {
        if (tasks !== undefined) {
            const wasLoaded = tasksLoaded;
            tasksCache = tasks;
            tasksLoaded = true;

            if (!wasLoaded) {
                loadingListeners.forEach((listener) => listener());
            }

            if (tasks !== tasksCache || !wasLoaded) {
                tasksListeners.forEach((listener) => listener());
            }
        }
    });

    return () => {
        subscription.unsubscribe();
        tasksListeners.delete(callback);
        if (tasksListeners.size === 0) {
            observableInstance = null;
            tasksLoaded = false;
        }
    };
};

const subscribeToLoading = (callback: () => void): (() => void) => {
    loadingListeners.add(callback);
    return () => {
        loadingListeners.delete(callback);
    };
};

const getTasksSnapshot = (): Task[] => {
    return tasksCache;
};

const getLoadingSnapshot = (): boolean => {
    return !tasksLoaded;
};

export const useHomeContainer = (): UseHomeContainerReturn => {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const tasks = useSyncExternalStore(
        subscribeToTasks,
        getTasksSnapshot,
        () => EMPTY_TASKS_ARRAY
    );

    const isLoading =
        useSyncExternalStore(
            subscribeToLoading,
            getLoadingSnapshot,
            () => true
        ) && isAuthenticated;

    const getTasksPerDayData = (): ChartDataPoint[] => {
        const grouped: Record<string, number> = {};
        tasks.forEach((task) => {
            const date = new Date(
                `${task.date}T${task.time}`
            ).toLocaleDateString();
            grouped[date] = (grouped[date] || 0) + 1;
        });

        return Object.entries(grouped)
            .map(([date, count]) => ({ date, count }))
            .sort(
                (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
            )
            .slice(-7);
    };

    const getStatusData = (): PieChartDataPoint[] => {
        return [
            {
                name: "To Do",
                value: tasks.filter((t) => t.status === "Todo").length,
            },
            {
                name: "In Progress",
                value: tasks.filter((t) => t.status === "In Progress").length,
            },
            {
                name: "Done",
                value: tasks.filter((t) => t.status === "Done").length,
            },
        ];
    };

    const getJiraStatsData = (): PieChartDataPoint[] => {
        const withJira = tasks.filter((t) => t.jiraLink).length;
        const withoutJira = tasks.length - withJira;
        return [
            { name: "With Jira", value: withJira },
            { name: "Without Jira", value: withoutJira },
        ];
    };

    const handleSignIn = (): void => {
        router.push("/auth/signin");
    };

    const handleOpenLogoutModal = (): void => {
        setShowLogoutModal(true);
    };

    const handleCloseLogoutModal = (): void => {
        setShowLogoutModal(false);
    };

    const handleConfirmLogout = async (): Promise<void> => {
        setShowLogoutModal(false);
        void dexieAuthService.signOut();

        if ("caches" in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            } catch (error) {
                console.error("Error clearing cache:", error);
            }
        }

        tasksCache = EMPTY_TASKS_ARRAY;
        tasksLoaded = false;
        observableInstance = null;

        window.location.href = "/auth/signin";
    };

    const handleGoToTasks = (): void => {
        router.push("/tasks");
    };

    return {
        tasks,
        isLoading,
        isAuthenticated,
        showLogoutModal,
        getTasksPerDayData,
        getStatusData,
        getJiraStatsData,
        handleSignIn,
        handleOpenLogoutModal,
        handleCloseLogoutModal,
        handleConfirmLogout,
        handleGoToTasks,
    };
};
