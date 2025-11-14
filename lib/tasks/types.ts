import { Task } from "../dexie/types";

export type TaskStatus = "Todo" | "In Progress" | "Done";

export type DateRange = "week" | "month" | "all";

export type CreateTaskInput = Omit<Task, "id">;

export type UpdateTaskInput = Partial<Omit<Task, "id">>;
