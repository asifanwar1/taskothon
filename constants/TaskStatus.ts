export const TASK_STATUS = {
    Todo: "Todo",
    InProgress: "In Progress",
    Done: "Done",
} as const;

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
