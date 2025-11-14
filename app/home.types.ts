import type { Task } from "@/lib/dexie/types";

export type ChartDataPoint = {
    date: string;
    count: number;
};

export type PieChartDataPoint = {
    name: string;
    value: number;
};

export type UseHomeContainerReturn = {
    tasks: Task[];
    isLoading: boolean;
    isAuthenticated: boolean;
    showLogoutModal: boolean;
    getTasksPerDayData: () => ChartDataPoint[];
    getStatusData: () => PieChartDataPoint[];
    getJiraStatsData: () => PieChartDataPoint[];
    handleSignIn: () => void;
    handleOpenLogoutModal: () => void;
    handleCloseLogoutModal: () => void;
    handleConfirmLogout: () => Promise<void>;
    handleGoToTasks: () => void;
};
