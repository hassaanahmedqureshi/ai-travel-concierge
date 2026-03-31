"use client";


import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import { Message, Location } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_LOCATIONS: Location[] = [{ name: "World", lat: 20, lng: 0 }];


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeLocations, setActiveLocations] = useState<Location[]>(DEFAULT_LOCATIONS);

  async function handleSend(content: string) {
    const userMessage: Message = { role: "user", content };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
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
      <div className="flex flex-col h-screen bg-white dark:bg-zinc-950">
        <Header />
        <div className="flex flex-1 min-h-0">
          <ChatPanel messages={messages} loading={loading} onSend={handleSend} />
          <div className="flex-1 min-h-0">
            <MapView locations={activeLocations} />
          </div>
        </div>
      </div>
  );
}
