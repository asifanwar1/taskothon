import { z } from "zod";
import type { Task } from "@/lib/dexie/types";

export const StandupRangeSchema = z.union([
    z.literal("day"),
    z.literal("week"),
    z.literal("month"),
]);

export type StandupRange = z.infer<typeof StandupRangeSchema>;

const TaskForAiSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    status: z.string(),
    date: z.string(),
    time: z.string().optional(),
    hoursSpent: z.number().optional(),
});

export type TaskForAi = z.infer<typeof TaskForAiSchema>;

export const TaskStandupRequestSchema = z.object({
    task: TaskForAiSchema,
});

export const TaskStandupResponseSchema = z.object({
    standup: z.string(),
});

export const SummaryRequestSchema = z.object({
    range: StandupRangeSchema,
    tasks: z.array(TaskForAiSchema),
});

export const SummaryResponseSchema = z.object({
    summary: z.string(),
});

export type TaskStandupRequest = z.infer<typeof TaskStandupRequestSchema>;
export type TaskStandupResponse = z.infer<typeof TaskStandupResponseSchema>;
export type SummaryRequest = z.infer<typeof SummaryRequestSchema>;
export type SummaryResponse = z.infer<typeof SummaryResponseSchema>;

export const mapTaskToAiInput = (task: Task): TaskForAi => ({
    id: task.id,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    date: task.date,
    time: task.time,
    hoursSpent: task.hoursSpent,
});
