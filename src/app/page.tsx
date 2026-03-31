"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("../components/MapView"), { ssr: false });

type Location = { name: string; lat: number; lng: number };

type Message = {
  role: "user" | "assistant";
  content: string;
  locations?: Location[];
};

const DEFAULT_LOCATIONS: Location[] = [{ name: "World", lat: 20, lng: 0 }];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeLocations, setActiveLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, data]);
    if (data.locations?.length > 0) setActiveLocations(data.locations);
    setLoading(false);
  }

  return (
      <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">

        {/* Header */}
        <header className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">✈️ AI Travel Concierge</h1>
          <p className="text-xs text-zinc-500">Describe your trip and get a personalized itinerary</p>
        </header>

        {/* Body */}
        <div className="flex flex-1 min-h-0">

          {/* Chat panel */}
          <div className="flex flex-col w-[420px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800">
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.length === 0 && (
                  <div className="text-center text-zinc-400 mt-16">
                    <p className="text-3xl mb-3">🌍</p>
                    <p className="text-sm font-medium">Where do you want to go?</p>
                    <p className="text-xs mt-1 text-zinc-400">Try: "5 days in Sicily, budget traveler, love food and hiking"</p>
                  </div>
              )}

              {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
                        m.role === "user"
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 whitespace-pre-wrap"
                            : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                    }`}>
                      {m.role === "user" ? m.content : (
                          <ReactMarkdown components={{
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-50">{children}</strong>,
                            ul: ({ children }) => <ul className="space-y-1 my-1.5">{children}</ul>,
                            li: ({ children }) => <li className="flex gap-2"><span className="text-zinc-400">•</span><span>{children}</span></li>,
                          }}>
                            {m.content}
                          </ReactMarkdown>
                      )}
                    </div>
                  </div>
              ))}

              {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3 py-2 text-sm text-zinc-400">
                      Planning your trip...
                    </div>
                  </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-3 py-3">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Describe your trip..."
                    className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:text-zinc-100"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-40 hover:opacity-80 transition-opacity"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Map panel — fills remaining space */}
          <div className="flex-1 min-h-0">
            <MapView locations={activeLocations} />
          </div>

        </div>
      </div>
  );
}
