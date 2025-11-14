"use client";

import {
    Workflow,
    LogOut,
    CheckCircle,
    Link2,
    Target,
    Clock,
    PieChart,
} from "lucide-react";
import { BarChartCard, LineChartCard, PieChartCard } from "@/components/Charts";
import Header from "@/components/Header/Header";
import { Button } from "@/components/Button";
import Modal from "@/components/Modal/Modal";
import { useHomeContainer } from "./home.container";
import logo from "@/assets/logo.svg";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Home() {
    const {
        tasks,
        isLoading,
        isAuthenticated,
        showLogoutModal,
        getTasksPerDayData,
        getStatusData,
        getJiraStatsData,
        handleOpenLogoutModal,
        handleCloseLogoutModal,
        handleConfirmLogout,
        handleGoToTasks,
    } = useHomeContainer();

    const stats = [
        {
            label: "Total Tasks",
            value: tasks.length,
            icon: Target,
            color: "text-blue-600",
        },
        {
            label: "Completed",
            value: tasks.filter((t) => t.status === "Done").length,
            icon: CheckCircle,
            color: "text-green-600",
        },
        {
            label: "In Progress",
            value: tasks.filter((t) => t.status === "In Progress").length,
            icon: Clock,
            color: "text-orange-600",
        },
        {
            label: "With Jira",
            value: tasks.filter((t) => t.jiraLink).length,
            icon: Link2,
            color: "text-purple-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Header
                        title="Taskothon"
                        description="Engineering Task Tracker"
                        className="w-full shadow-none !bg-transparent"
                        icon={logo}
                        isAuthenticated={isAuthenticated}
                        handleLogout={handleOpenLogoutModal}
                    />
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="space-y-8">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-2">
                                    Welcome back! 👋
                                </h2>
                                <p className="text-blue-100">
                                    Here's your productivity overview
                                </p>
                            </div>
                            <Button
                                onClick={handleGoToTasks}
                                icon={Workflow}
                                variant="light"
                            >
                                Manage Tasks
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl p-4 lg:p-6 shadow-md hover:shadow-lg transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <stat.icon
                                        className={`w-5 h-5 lg:w-6 lg:h-6 ${stat.color}`}
                                    />
                                </div>
                                <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs lg:text-sm text-gray-600">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {isLoading ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">
                                Loading your analytics...
                            </p>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                            <PieChart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                No tasks yet
                            </h3>
                            <p className="text-lg text-gray-600 mb-6">
                                Start by creating your first task to see your
                                analytics dashboard!
                            </p>
                            <Button
                                onClick={handleGoToTasks}
                                icon={Workflow}
                                variant="primary"
                                size="lg"
                            >
                                Create Your First Task
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Analytics Dashboard
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                <BarChartCard
                                    title="Tasks Per Day"
                                    data={getTasksPerDayData()}
                                    barColor="#3b82f6"
                                />

                                <PieChartCard
                                    title="Task Status"
                                    data={getStatusData()}
                                    colors={COLORS}
                                />

                                <PieChartCard
                                    title="Jira Ticket Coverage"
                                    data={getJiraStatsData()}
                                    colors={[COLORS[0], COLORS[3]]}
                                />

                                <LineChartCard
                                    title="Completion Trend"
                                    data={getTasksPerDayData()}
                                    lineColor="#10b981"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Modal
                isOpen={showLogoutModal}
                onClose={handleCloseLogoutModal}
                title="Confirm Logout"
                description="Are you sure you want to logout?"
                size="sm"
                mainContainerClass="bg-white"
                childrenContainerClass="bg-white"
                descriptionClass="!text-gray-900"
                primaryButton={{
                    label: "Logout",
                    onClick: handleConfirmLogout,
                }}
                secondaryButton={{
                    label: "Cancel",
                    onClick: handleCloseLogoutModal,
                }}
                icon={<LogOut className="w-6 h-6 text-red-600" />}
            />
        </div>
    );
}
