"use client";

import { useRouter } from "next/navigation";
import {
    Plus,
    Download,
    Home,
    CheckCircle,
    Clock,
    Circle,
    ExternalLink,
    Trash2,
    Edit,
    Filter,
    Calendar,
} from "lucide-react";
import Header from "@/components/Header/Header";
import Modal from "@/components/Modal/Modal";
import TaskForm from "./tasks.form";
import { useTasksContainer } from "./tasks.container";
import type { Task } from "@/lib/dexie/types";
import logo from "@/assets/logo.svg";
import { useAutoArchive } from "@/hooks/useAutoArchive";

const StatusIcon = ({ status }: { status: Task["status"] }) => {
    if (status === "Done") {
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (status === "In Progress") {
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
    return <Circle className="w-5 h-5 text-gray-400" />;
};

const TasksPage = () => {
    const router = useRouter();
    useAutoArchive();
    const {
        tasks,
        isLoading,
        filterStatus,
        modalMode,
        currentMonthDisplay,
        stats,
        formMethods,
        getFilteredMonthDays,
        setFilterStatus,
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
        onFormSubmit,
    } = useTasksContainer();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Header
                        title="Taskothon"
                        description="Track your daily engineering tasks"
                        className="w-full shadow-none !bg-transparent"
                        icon={logo}
                        actions={[
                            {
                                label: "Home",
                                icon: Home,
                                onClick: () => router.push("/"),
                                variant: "secondary",
                            },
                            {
                                label: "Export",
                                icon: Download,
                                onClick: handleExportTasks,
                                variant: "success",
                            },
                            {
                                label: "Add Task",
                                icon: Plus,
                                onClick: handleAddTask,
                                variant: "primary",
                            },
                        ]}
                    />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center justify-center gap-3">
                                    <Filter className="w-5 h-5 text-blue-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Filter Tasks
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setFilterStatus("today")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                                        filterStatus === "today"
                                            ? "bg-blue-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Today ({stats.today})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("all")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                                        filterStatus === "all"
                                            ? "bg-purple-500 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    All ({stats.total})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("Todo")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                                        filterStatus === "Todo"
                                            ? "bg-gray-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    To Do ({stats.todo})
                                </button>
                                <button
                                    onClick={() =>
                                        setFilterStatus("In Progress")
                                    }
                                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                                        filterStatus === "In Progress"
                                            ? "bg-orange-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    In Progress ({stats.inProgress})
                                </button>
                                <button
                                    onClick={() => setFilterStatus("Done")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                                        filterStatus === "Done"
                                            ? "bg-green-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Done ({stats.done})
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                                {currentMonthDisplay}
                            </span>
                        </div>
                    </div>
                </div>

                {isLoading && tasks.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Loading tasks...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {getFilteredMonthDays().map((date) => {
                            const dateTasks = getFilteredTasksForDate(date);
                            const hasActiveTasks = dateTasks.length > 0;

                            return (
                                <div
                                    key={date.toISOString()}
                                    className={`bg-white rounded-2xl shadow-md overflow-hidden transition-all ${
                                        isToday(date)
                                            ? "ring-2 ring-blue-500"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`px-6 py-4 border-b ${
                                            isToday(date)
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                                : hasActiveTasks
                                                ? "bg-gray-50"
                                                : "bg-gray-50"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        isToday(date)
                                                            ? "bg-white"
                                                            : hasActiveTasks
                                                            ? "bg-blue-600"
                                                            : "bg-gray-300"
                                                    }`}
                                                />
                                                <h3
                                                    className={`text-lg font-bold ${
                                                        isToday(date)
                                                            ? "text-white"
                                                            : "text-gray-900"
                                                    }`}
                                                >
                                                    {formatDate(date)}
                                                </h3>
                                                <span
                                                    className={`text-sm ${
                                                        isToday(date)
                                                            ? "text-blue-100"
                                                            : "text-gray-500"
                                                    }`}
                                                >
                                                    {formatDate(date)}
                                                </span>
                                            </div>
                                            <div
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    isToday(date)
                                                        ? "bg-white/20 text-white"
                                                        : hasActiveTasks
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-200 text-gray-600"
                                                }`}
                                            >
                                                {dateTasks.length}{" "}
                                                {dateTasks.length === 1
                                                    ? "task"
                                                    : "tasks"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        {dateTasks.length === 0 ? (
                                            <p className="text-center text-gray-400 py-8">
                                                No tasks for this day
                                            </p>
                                        ) : (
                                            <div className="space-y-3">
                                                {dateTasks.map((task) => (
                                                    <div
                                                        key={task.id}
                                                        className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex items-start gap-3 flex-1 min-w-0">
                                                                <StatusIcon
                                                                    status={
                                                                        task.status
                                                                    }
                                                                />
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 mb-1">
                                                                        {
                                                                            task.title
                                                                        }
                                                                    </h4>
                                                                    {task.description && (
                                                                        <p className="text-gray-600 text-sm mb-2">
                                                                            {
                                                                                task.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            {new Date(
                                                                                `${task.date}T${task.time}`
                                                                            ).toLocaleTimeString(
                                                                                "en-US",
                                                                                {
                                                                                    hour: "numeric",
                                                                                    minute: "2-digit",
                                                                                }
                                                                            )}
                                                                        </span>
                                                                        {task.jiraLink && (
                                                                            <a
                                                                                href={
                                                                                    task.jiraLink
                                                                                }
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                                                            >
                                                                                <ExternalLink className="w-3 h-3" />
                                                                                Jira
                                                                                Ticket
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <select
                                                                    value={
                                                                        task.status
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleUpdateTaskStatus(
                                                                            task.id ||
                                                                                "",
                                                                            e
                                                                                .target
                                                                                .value as Task["status"]
                                                                        )
                                                                    }
                                                                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                                >
                                                                    <option value="Todo">
                                                                        To Do
                                                                    </option>
                                                                    <option value="In Progress">
                                                                        In
                                                                        Progress
                                                                    </option>
                                                                    <option value="Done">
                                                                        Done
                                                                    </option>
                                                                </select>
                                                                <button
                                                                    onClick={() =>
                                                                        handleEditTask(
                                                                            task
                                                                        )
                                                                    }
                                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                                    title="Edit task"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteTask(
                                                                            task.id ||
                                                                                ""
                                                                        )
                                                                    }
                                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                                    title="Delete task"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <Modal
                isOpen={modalMode !== null}
                onClose={handleCloseModal}
                title={modalMode === "add" ? "Add New Task" : "Update Task"}
                size="md"
            >
                <TaskForm
                    mode={modalMode!}
                    isLoading={isLoading}
                    onCancel={handleCloseModal}
                    formMethods={formMethods}
                    onSubmit={onFormSubmit}
                />
            </Modal>
        </div>
    );
};

export default TasksPage;
