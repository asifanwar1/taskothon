import Dexie, { Table } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import type { Task } from "./types";

export class TaskDB extends Dexie {
    tasks!: Table<Task, string>;

    constructor() {
        super("taskothon_db", { addons: [dexieCloud] });

        this.version(1).stores({
            tasks: "@id, title, description, date, time, jiraLink, status, category",
        });

        const databaseUrl = "https://zz8g27g95.dexie.cloud";

        if (!databaseUrl) {
            throw new Error(
                "NEXT_PUBLIC_DEXIE_CLOUD_URL environment variable is not set. Please add it to your .env.local file."
            );
        }

        this.cloud.configure({
            databaseUrl,
            requireAuth: true,
            customLoginGui: true,
        });

        if (process.env.NODE_ENV === "production") {
            Dexie.debug = false;
        }
    }
}

export const db = new TaskDB();
