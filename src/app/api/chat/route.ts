import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const SYSTEM_PROMPT = `You are an expert travel concierge. When a user describes a trip, generate a detailed day-by-day itinerary with real places, restaurants, and tips.

Format each day exactly like this:
**Day 1: [Theme/Title]**
- Morning: [activity + place name + brief tip]
- Afternoon: [activity + place name + brief tip]
- Evening: [restaurant or activity + place name + brief tip]

Rules:
- Use real, specific place names
- Match the budget and travel style the user mentions
- Keep each point concise but useful
- After the itinerary, add a short "Tips" section with 2-3 practical travel tips
- If the user asks to refine or change something, adjust only what they ask and keep the rest`;

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1].content;

    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();

    return NextResponse.json({ role: "assistant", content: text });

}