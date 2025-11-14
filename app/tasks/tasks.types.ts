import type { Task } from "@/lib/dexie/types";
import type { TaskStatus, DateRange } from "@/lib/tasks/types";
import type { UseFormReturn } from "react-hook-form";
import type { TaskFormSchema } from "./tasks.validation";

export type TaskFormMode = "add" | "edit";

export type TaskFormData = {
    title: string;
    description: string;
    jiraLink: string;
    status: TaskStatus;
    date: string;
    hoursSpent: string;
};

export type UseTasksContainerReturn = {
    tasks: Task[];
    filteredTasks: Task[];
    isLoading: boolean;
    filterStatus: TaskStatus | "all" | "today";
    filterDateRange: DateRange;
    modalMode: TaskFormMode | null;
    selectedTask: Task | null;
    formData: TaskFormData;
    currentMonthDays: Date[];
    currentMonthDisplay: string;
    tasksByDate: Record<string, Task[]>;
    formMethods: UseFormReturn<TaskFormSchema>;
    stats: {
        total: number;
        todo: number;
        inProgress: number;
        done: number;
        today: number;
    };
    setFilterStatus: (status: TaskStatus | "all" | "today") => void;
    getFilteredMonthDays: () => Date[];
    setFilterDateRange: (range: DateRange) => void;
    handleAddTask: () => void;
    handleEditTask: (task: Task) => void;
    handleDeleteTask: (taskId: string) => void;
    handleUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
    handleCloseModal: () => void;
    handleSubmitTask: (data: TaskFormSchema) => Promise<void>;
    handleExportTasks: () => void;
    getFilteredTasksForDate: (date: Date) => Task[];
    formatDate: (date: Date) => string;
    isToday: (date: Date) => boolean;
    getTasksPerDayData: () => Array<{ date: string; count: number }>;
    getStatusData: () => Array<{ name: string; value: number }>;
    getJiraStatsData: () => Array<{ name: string; value: number }>;
    onFormSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export type TaskFormProps = {
    mode: TaskFormMode;
    isLoading: boolean;
    formMethods: UseFormReturn<TaskFormSchema>;
    onCancel: () => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};
