"use client";

import type { DXCInputField } from "dexie-cloud-addon";
import {
    LogIn,
    CheckCircle,
    BarChart3,
    Link2,
    Calendar,
    TrendingUp,
    Zap,
} from "lucide-react";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useSigninContainer } from "./signin.container";

const SignIn = () => {
    const {
        ui,
        params,
        isSubmitting,
        handleSubmit,
        handleFieldChange,
        getTitle,
        getDescription,
        resolveText,
    } = useSigninContainer();

    const features = [
        {
            icon: CheckCircle,
            title: "Task Management",
            description: "Track your daily engineering tasks with ease",
        },
        {
            icon: BarChart3,
            title: "Visual Analytics",
            description: "Get insights with charts and productivity metrics",
        },
        {
            icon: Link2,
            title: "Jira Integration",
            description: "Link tasks to Jira tickets seamlessly",
        },
        {
            icon: TrendingUp,
            title: "Completion Trends",
            description: "Monitor your productivity over time",
        },
    ];

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 lg:p-12 flex flex-col justify-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `radial-gradient(circle at 20px 20px, white 1px, transparent 0)`,
                            backgroundSize: "40px 40px",
                        }}
                    />
                </div>

                <div className="relative z-10 max-w-xl mx-auto">
                    <div className="mb-8 lg:mb-12">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
                                <Calendar className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold">
                                    Taskothon
                                </h1>
                                <p className="text-blue-100 text-sm lg:text-base">
                                    Engineering Task Tracker
                                </p>
                            </div>
                        </div>
                        <p className="text-lg lg:text-xl text-blue-50 leading-relaxed">
                            Streamline your workflow, track your progress, and
                            boost productivity with intelligent task management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
                            >
                                <feature.icon className="w-6 h-6 mb-2 text-blue-200" />
                                <h3 className="font-semibold text-white mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-blue-100">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/20">
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-300" />
                            <span className="text-blue-50">Real-time sync</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-300" />
                            <span className="text-blue-50">
                                Secure & private
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 bg-gray-50 p-8 lg:p-12 flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-center">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <LogIn className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center">
                                {getTitle()}
                            </h2>
                            <p className="text-sm lg:text-base text-gray-600 text-center">
                                {getDescription()}
                            </p>
                        </div>

                        {ui && (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {ui.alerts?.map((alert, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl text-sm font-medium ${
                                            alert.type === "error"
                                                ? "bg-red-50 text-red-700 border border-red-200"
                                                : alert.type === "warning"
                                                ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                                : "bg-blue-50 text-blue-700 border border-blue-200"
                                        }`}
                                    >
                                        {resolveText(alert)}
                                    </div>
                                ))}

                                {Object.entries(ui.fields || {}).map(
                                    ([fieldName, field]) => {
                                        const inputField =
                                            field as DXCInputField;
                                        return (
                                            <Input
                                                key={fieldName}
                                                label={inputField.label}
                                                type={inputField.type || "text"}
                                                value={params[fieldName] || ""}
                                                onChange={(e) => {
                                                    handleFieldChange(
                                                        fieldName,
                                                        e.target.value
                                                    );
                                                }}
                                                placeholder={
                                                    inputField.placeholder
                                                }
                                                fullWidth
                                                required
                                            />
                                        );
                                    }
                                )}

                                {ui.onSubmit !== undefined &&
                                    ui.onSubmit !== null && (
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            fullWidth
                                            icon={LogIn}
                                            disabled={isSubmitting}
                                            className="!py-3 !text-base"
                                        >
                                            {isSubmitting
                                                ? "Submitting..."
                                                : ui.submitLabel || "Continue"}
                                        </Button>
                                    )}
                            </form>
                        )}

                        {!ui && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-gray-600">
                                    Initializing login...
                                </p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <p className="text-xs text-center text-gray-500">
                                By signing in, you'll get access to task
                                tracking, analytics, and productivity insights.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Secure authentication powered by Dexie Cloud
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
