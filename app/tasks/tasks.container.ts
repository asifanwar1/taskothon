import { useState } from "react";
import { liveQuery } from "dexie";
import { useSyncExternalStore } from "react";
import { dexieAuthService } from "@/lib/dexie/auth.service";

import { dexieTasksService } from "@/lib/tasks/tasks.service";
import { TASK_STATUS } from "@/constants/TaskStatus";
import type { Task } from "@/lib/dexie/types";
import type { TaskStatus, DateRange } from "@/lib/tasks/types";
import type {
    TaskFormMode,
    TaskFormData,
    UseTasksContainerReturn,
} from "./tasks.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, type TaskFormSchema } from "./tasks.validation";
import { showToast } from "@/lib/toast";
import { formatDate } from "@/utils/date.utils";
import { exportTasksToExcel, getMonthYearFilename } from "@/utils/excel.utils";

const initialFormData: TaskFormData = {
    title: "",
    description: "",
    jiraLink: "",
    status: TASK_STATUS.Todo,
    date: new Date().toISOString().split("T")[0],
    hoursSpent: "",
};

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

const getCurrentMonthDays = (currentMonthOffset: number): Date[] => {
    const days: Date[] = [];
    const today = new Date();

    const targetDate = new Date(
        today.getFullYear(),
        today.getMonth() + currentMonthOffset,
        1
    );

    const lastDay = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth() + 1,
        0
    );

    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(
            targetDate.getFullYear(),
            targetDate.getMonth(),
            day
        );
        days.push(date);
    }

    return days.reverse();
};

const getCurrentMonthDisplay = (currentMonthOffset: number): string => {
    const today = new Date();
    const targetDate = new Date(
        today.getFullYear(),
        today.getMonth() + currentMonthOffset,
        1
    );
    return targetDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

const getTasksByDate = (tasks: Task[]): Record<string, Task[]> => {
    const grouped: Record<string, Task[]> = {};

    tasks.forEach((task) => {
        const taskDate = task.date;
        if (!grouped[taskDate]) {
            grouped[taskDate] = [];
        }
        grouped[taskDate].push(task);
    });

    return grouped;
};

const getStatusCounts = (tasks: Task[]) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const todayTasks = tasks.filter((task) => task.date === todayStr);

    return {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === TASK_STATUS.Todo).length,
        inProgress: tasks.filter((t) => t.status === TASK_STATUS.InProgress)
            .length,
        done: tasks.filter((t) => t.status === TASK_STATUS.Done).length,
        today: todayTasks.length,
    };
};

export const useTasksContainer = (): UseTasksContainerReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [filterStatus, setFilterStatus] = useState<
        TaskStatus | "all" | "today"
    >("today");
    const [filterDateRange, setFilterDateRange] = useState<DateRange>("week");
    const [modalMode, setModalMode] = useState<TaskFormMode | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [formData, setFormData] = useState<TaskFormData>(initialFormData);
    const [tasksCache, setTasksCache] = useState<Task[]>([]);

    const tasksObservable = liveQuery(async () => {
        try {
            const user = dexieAuthService.getCurrentUser();
            if (!user) {
                return [];
            }
            const loadedTasks = await dexieTasksService.getTasks();
            return loadedTasks;
        } catch (error) {
            console.error("Error loading tasks:", error);
            return [];
        }
    });

    const tasks = useSyncExternalStore(
        (callback) => {
            const subscription = tasksObservable.subscribe((tasks) => {
                if (tasks !== undefined) {
                    setTasksCache(tasks);
                    callback();
                }
            });
            return () => subscription.unsubscribe();
        },
        () => tasksCache,
        () => []
    );

    const formMethods = useForm<TaskFormSchema>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: formData.title,
            description: formData.description,
            jiraLink: formData.jiraLink,
            status: formData.status,
            date: formData.date,
            hoursSpent: formData.hoursSpent,
        },
    });

    let tasksToFilter = tasks;

    if (filterStatus === "today") {
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];
        tasksToFilter = tasksToFilter.filter((task) => task.date === todayStr);
    } else if (filterStatus !== "all") {
        tasksToFilter = filterByStatus(tasksToFilter, filterStatus);
    }

    const filteredTasks = sortTasksByDate(
        filterByDateRange(tasksToFilter, filterDateRange)
    );

    const currentMonthDays = getCurrentMonthDays(0);
    const currentMonthDisplay = getCurrentMonthDisplay(0);
    const tasksByDate = getTasksByDate(tasks);
    const stats = getStatusCounts(tasks);

    const getFilteredTasksForDate = (date: Date): Task[] => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const dateTasks = tasksByDate[dateStr] || [];

        if (filterStatus === "all") {
            return dateTasks;
        }

        if (filterStatus === "today") {
            const today = new Date();
            if (date.toDateString() === today.toDateString()) {
                return dateTasks;
            }
            return [];
        }

        return dateTasks.filter((task) => task.status === filterStatus);
    };

    const getFilteredMonthDays = (): Date[] => {
        if (filterStatus === "all") {
            return currentMonthDays;
        }

        if (filterStatus === "today") {
            const today = new Date();
            return currentMonthDays.filter((date) => {
                return date.toDateString() === today.toDateString();
            });
        }

        return currentMonthDays.filter((date) => {
            const dateTasks = getFilteredTasksForDate(date);
            return dateTasks.length > 0;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const handleAddTask = () => {
        const newFormData = initialFormData;
        setFormData(newFormData);
        setSelectedTask(null);
        setModalMode("add");
        formMethods.reset({
            title: newFormData.title,
            description: newFormData.description,
            jiraLink: newFormData.jiraLink,
            status: newFormData.status,
            date: newFormData.date,
            hoursSpent: newFormData.hoursSpent,
        });
    };

    const handleEditTask = (task: Task) => {
        const newFormData: TaskFormData = {
            title: task.title,
            description: task.description || "",
            jiraLink: task.jiraLink || "",
            status: task.status,
            date: task.date,
            hoursSpent: "",
        };
        setFormData(newFormData);
        setSelectedTask(task);
        setModalMode("edit");
        formMethods.reset({
            title: newFormData.title,
            description: newFormData.description,
            jiraLink: newFormData.jiraLink,
            status: newFormData.status,
            date: newFormData.date,
            hoursSpent: newFormData.hoursSpent,
        });
    };

    const handleDeleteTask = async (taskId: string) => {
        setIsLoading(true);
        try {
            await dexieTasksService.deleteTask(taskId);
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTaskStatus = async (
        taskId: string,
        status: TaskStatus
    ) => {
        setIsLoading(true);
        try {
            await dexieTasksService.updateTask(taskId, { status });
        } catch (error) {
            console.error("Error updating task status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalMode(null);
        setSelectedTask(null);
        const newFormData = initialFormData;
        setFormData(newFormData);
        formMethods.reset({
            title: newFormData.title,
            description: newFormData.description,
            jiraLink: newFormData.jiraLink,
            status: newFormData.status,
            date: newFormData.date,
            hoursSpent: newFormData.hoursSpent,
        });
    };

    const handleSubmitTask = async (data: TaskFormSchema) => {
        setIsLoading(true);
        try {
            const now = new Date();
            const time = now.toTimeString().split(" ")[0];

            if (modalMode === "add") {
                await dexieTasksService.createTask({
                    title: data.title,
                    description: data.description,
                    jiraLink: data.jiraLink || undefined,
                    status: data.status,
                    date: data.date,
                    time,
                });
                showToast.success("Task added successfully!");
            } else if (modalMode === "edit" && selectedTask) {
                await dexieTasksService.updateTask(selectedTask.id!, {
                    title: data.title,
                    description: data.description,
                    jiraLink: data.jiraLink || undefined,
                    status: data.status,
                    date: data.date,
                });
                showToast.success("Task updated successfully!");
            }
            handleCloseModal();
        } catch (error) {
            console.error("Error saving task:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to save task. Please try again.";
            showToast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const onFormSubmit = formMethods.handleSubmit(handleSubmitTask);

    const handleExportTasks = () => {
        if (filteredTasks.length === 0) {
            showToast.info("No tasks to export.");
            return;
        }

        const filename = getMonthYearFilename(new Date());
        exportTasksToExcel(filteredTasks, filename);
        showToast.success("Tasks exported successfully!");
    };

    const getTasksPerDayData = () => {
        const grouped: Record<string, number> = {};
        filteredTasks.forEach((task) => {
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

    const getStatusData = () => {
        return [
            {
                name: "To Do",
                value: filteredTasks.filter(
                    (t) => t.status === TASK_STATUS.Todo
                ).length,
            },
            {
                name: "In Progress",
                value: filteredTasks.filter(
                    (t) => t.status === TASK_STATUS.InProgress
                ).length,
            },
            {
                name: "Done",
                value: filteredTasks.filter(
                    (t) => t.status === TASK_STATUS.Done
                ).length,
            },
        ];
    };

    const getJiraStatsData = () => {
        const withJira = filteredTasks.filter((t) => t.jiraLink).length;
        const withoutJira = filteredTasks.length - withJira;
        return [
            { name: "With Jira", value: withJira },
            { name: "Without Jira", value: withoutJira },
        ];
    };

    return {
        tasks,
        filteredTasks,
        isLoading,
        filterStatus,
        filterDateRange,
        modalMode,
        selectedTask,
        formData,
        currentMonthDays,
        currentMonthDisplay,
        tasksByDate,
        stats,
        formMethods,
        getFilteredMonthDays,
        onFormSubmit,
        setFilterStatus,
        setFilterDateRange,
        handleAddTask,
        handleEditTask,
        handleDeleteTask,
        handleUpdateTaskStatus,
        handleCloseModal,
        handleSubmitTask,
        handleExportTasks,
        getFilteredTasksForDate,
        formatDate,
        isToday,
        getTasksPerDayData,
        getStatusData,
        getJiraStatsData,
    };
};
