import * as XLSX from "xlsx";
import type { Task } from "@/lib/dexie/types";

export const exportTasksToExcel = (tasks: Task[], filename: string): void => {
    const worksheetData = tasks.map((task) => ({
        Title: task.title,
        Description: task.description || "",
        Status: task.status,
        Date: task.date,
        Time: task.time,
        "Jira Link": task.jiraLink || "",
        Category: task.category || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

    const maxWidth = worksheetData.reduce((acc, row) => {
        Object.values(row).forEach((cell) => {
            const cellLength = String(cell).length;
            if (cellLength > acc) {
                acc = cellLength;
            }
        });
        return acc;
    }, 10);

    worksheet["!cols"] = [
        { wch: Math.min(maxWidth, 50) },
        { wch: Math.min(maxWidth, 50) },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
        { wch: 30 },
        { wch: 15 },
    ];

    XLSX.writeFile(workbook, filename);
};

export const getMonthYearString = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });
};

export const getMonthYearFilename = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `tasks-${year}-${month}.xlsx`;
};
