import { NextRequest, NextResponse } from "next/server";
import {
    TaskStandupRequestSchema,
    TaskStandupResponseSchema,
} from "@/lib/ai/standup.types";

const GROQ_MODEL = "llama-3.1-8b-instant";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "GROQ_API_KEY is not configured" },
            { status: 500 }
        );
    }

    const json = await req.json().catch(() => null);

    const parsed = TaskStandupRequestSchema.safeParse(json);
    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid request", details: parsed.error.flatten() },
            { status: 400 }
        );
    }

    const { task } = parsed.data;

    const prompt = [
        "You are an engineering assistant generating concise standup updates.",
        "Return exactly three lines, without any bullet characters or markdown.",
        "Each line must start with one of these labels exactly:",
        "Yesterday: ",
        "Today: ",
        "Blockers: ",
        "",
        `Task: ${task.title}`,
        task.description ? `Description: ${task.description}` : "",
        `Status: ${task.status}`,
        `Date: ${task.date} ${task.time ?? ""}`,
        task.hoursSpent !== undefined ? `Hours spent: ${task.hoursSpent}` : "",
    ].join("\n");

    try {
        const res = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    messages: [
                        {
                            role: "system",
                            content: "You write very concise standup updates.",
                        },
                        { role: "user", content: prompt },
                    ],
                }),
            }
        );

        if (!res.ok) {
            const errorBody = await res.text();
            console.error(
                "Groq API error (task-standup):",
                res.status,
                errorBody
            );
            return NextResponse.json(
                { error: "Groq API request failed" },
                { status: 500 }
            );
        }

        const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string } }>;
        };

        const standupText = data.choices?.[0]?.message?.content ?? "";

        const responseParse = TaskStandupResponseSchema.safeParse({
            standup: standupText,
        });

        if (!responseParse.success) {
            return NextResponse.json(
                { error: "Invalid AI response" },
                { status: 500 }
            );
        }

        return NextResponse.json(responseParse.data);
    } catch (error) {
        console.error("Error generating task standup:", error);
        return NextResponse.json(
            { error: "Failed to generate AI standup." },
            { status: 500 }
        );
    }
}
