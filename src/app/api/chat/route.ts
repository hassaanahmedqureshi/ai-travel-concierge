import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { MOCK_RESPONSE } from "@/lib/mockResponse";

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
- If the user asks to refine or change something, adjust only what they ask and keep the rest

IMPORTANT: At the very end of your response, append a JSON block in this exact format (no markdown, just raw):
LOCATIONS_JSON:[{"name":"Place Name","lat":0.0,"lng":0.0},...]

Include 5-10 key locations from the itinerary. Only real coordinates.`;

// export async function POST(req: NextRequest) {
//     const { messages } = await req.json();
//
//     const model = genAI.getGenerativeModel({
//         model: "gemini-2.5-flash",
//         systemInstruction: SYSTEM_PROMPT,
//     });
//
//     const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
//         role: m.role === "assistant" ? "model" : "user",
//         parts: [{ text: m.content }],
//     }));
//
//     const chat = model.startChat({ history })
//     const lastMessage = messages[messages.length - 1].content;
//
//     const result = await chat.sendMessage(lastMessage);
//     const raw = result.response.text();
//
//     const jsonMatch = raw.match(/LOCATIONS_JSON:(\[.*?])/s);
//     const locations = jsonMatch ? JSON.parse(jsonMatch[1]) : [];
//     const content = raw.replace(/LOCATIONS_JSON:\[.*?]/s, "").trim();
//
//     return NextResponse.json({ role: "assistant", content, locations });
//
// }

export async function POST() {
    await new Promise((r) => setTimeout(r, 800)); // simulate delay
    return NextResponse.json(MOCK_RESPONSE);
}