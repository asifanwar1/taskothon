import { NextRequest, NextResponse } from "next/server";
import {
    SummaryRequestSchema,
    SummaryResponseSchema,
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
    const parsed = SummaryRequestSchema.safeParse(json);

    if (!parsed.success) {
        return NextResponse.json(
            { error: "Invalid request", details: parsed.error.flatten() },
            { status: 400 }
        );
    }

    const { range, tasks } = parsed.data;

    const tasksText = tasks
        .map((t) => {
            const parts: string[] = [
                `Title: ${t.title}`,
                t.description ? `Description: ${t.description}` : "",
                `Status: ${t.status}`,
                `Date: ${t.date} ${t.time ?? ""}`,
                t.hoursSpent !== undefined ? `Hours: ${t.hoursSpent}` : "",
            ].filter(Boolean);
            return parts.join(" | ");
        })
        .join("\n");

    const prompt = [
        `Generate a concise ${range} engineering summary as plain text.`,
        "Do NOT use any markdown formatting: no *, -, #, numbered lists, or **bold**.",
        "Write four short sections with labels exactly like this:",
        "Accomplishments:",
        "Notable tasks:",
        "Risks / blockers:",
        "Next focus:",
        "",
        "Use normal sentences and paragraphs only.",
        "",
        "Tasks:",
        tasksText || "(no tasks)",
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
                            content:
                                "You write succinct engineering summaries.",
                        },
                        { role: "user", content: prompt },
                    ],
                }),
            }
        );

        if (!res.ok) {
            const errorBody = await res.text();
            console.error("Groq API error:", res.status, errorBody);
            return NextResponse.json(
                { error: "Groq API request failed" },
                { status: 500 }
            );
        }

        const data = (await res.json()) as unknown as {
            choices?: Array<{ message?: { content?: string } }>;
        };

        const summaryText = data.choices?.[0]?.message?.content ?? "";

        const responseParse = SummaryResponseSchema.safeParse({
            summary: summaryText,
        });

        if (!responseParse.success) {
            return NextResponse.json(
                { error: "Invalid AI response" },
                { status: 500 }
            );
        }

        return NextResponse.json(responseParse.data);
    } catch (error) {
        console.error("Error generating AI summary:", error);
        return NextResponse.json(
            { error: "Failed to generate AI summary." },
            { status: 500 }
        );
    }
}
