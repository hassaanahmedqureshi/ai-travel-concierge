"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import { Message, Location } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_LOCATIONS: Location[] = [{ name: "Rome", lat: 41.9028, lng: 12.4964 }];

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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f4f4f5" }}>
      <Header />
      <div style={{ display: "flex", flex: 1, minHeight: 0, gap: "16px", padding: "16px" }}>

        {/* Chat — 30% */}
        <div style={{ width: "30%", flexShrink: 0, display: "flex", flexDirection: "column", borderRadius: "16px", overflow: "hidden", border: "1px solid #e4e4e7", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <ChatPanel messages={messages} loading={loading} onSend={handleSend} />
        </div>

        {/* Map — 70% */}
        <div style={{ flex: 1, minHeight: 0, borderRadius: "16px", overflow: "hidden", border: "1px solid #e4e4e7", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <MapView locations={activeLocations} />
        </div>

      </div>
    </div>
  );
}
