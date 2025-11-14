"use client";

import type { TaskFormProps } from "./tasks.types";
import { TASK_STATUS } from "@/constants/TaskStatus";
import { Input } from "@/components/Input";

const TaskForm = ({
    mode,
    isLoading,
    onCancel,
    formMethods,
    onSubmit,
}: TaskFormProps) => {
    const {
        register,
        formState: { errors, isSubmitting },
    } = formMethods;

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex gap-3 flex-wrap">
                <Input
                    label="Title"
                    type="text"
                    {...register("title")}
                    placeholder="Enter task title"
                    fullWidth
                    wrapperClassName="flex-1"
                    className="h-[44px]"
                    error={errors.title?.message}
                />
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        {...register("status")}
                        className={`w-full px-3 sm:px-4 h-[44px] border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                            errors.status
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300"
                        }`}
                    >
                        <option value={TASK_STATUS.Todo}>To Do</option>
                        <option value={TASK_STATUS.InProgress}>
                            In Progress
                        </option>
                        <option value={TASK_STATUS.Done}>Done</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.status.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-3 flex-wrap">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        {...register("date")}
                        className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                            errors.date
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.date && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.date.message}
                        </p>
                    )}
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hours Spent
                    </label>
                    <input
                        type="number"
                        {...register("hoursSpent")}
                        className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                            errors.hoursSpent
                                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="0.0"
                        min="0"
                        step="0.5"
                    />
                    {errors.hoursSpent && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.hoursSpent.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    {...register("description")}
                    className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.description
                            ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                            : "border-gray-300"
                    }`}
                    rows={3}
                    placeholder="Enter task description"
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <Input
                label="Jira Link (Optional)"
                type="url"
                {...register("jiraLink")}
                placeholder="https://..."
                fullWidth
                error={errors.jiraLink?.message}
            />

            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading || isSubmitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading || isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading || isSubmitting
                        ? "Saving..."
                        : mode === "add"
                        ? "Add Task"
                        : "Update Task"}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
