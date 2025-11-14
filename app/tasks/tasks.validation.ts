import { z } from "zod";
import { TASK_STATUS } from "@/constants/TaskStatus";

export const taskFormSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required")
        .trim()
        .min(1, "Title cannot be empty"),
    description: z
        .string()
        .min(1, "Description is required")
        .trim()
        .min(1, "Description cannot be empty"),
    jiraLink: z
        .string()
        .url("Please enter a valid URL")
        .optional()
        .or(z.literal("")),
    status: z.enum(
        [TASK_STATUS.Todo, TASK_STATUS.InProgress, TASK_STATUS.Done] as const,
        {
            message: "Status is required",
        }
    ),
    date: z
        .string()
        .min(1, "Date is required")
        .refine(
            (date) => {
                const dateObj = new Date(date);
                return !isNaN(dateObj.getTime());
            },
            { message: "Please enter a valid date" }
        ),
    hoursSpent: z
        .string()
        .min(1, "Hours spent is required")
        .refine(
            (val) => {
                const num = parseFloat(val);
                return !isNaN(num) && num >= 0;
            },
            {
                message:
                    "Hours spent must be a valid number greater than or equal to 0",
            }
        ),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;
