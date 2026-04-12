"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import ChatPanel from "@/components/ChatPanel";
import { Message, Location } from "@/lib/types";
import {supabase} from "@/lib/supabase";
import {router} from "next/client";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const DEFAULT_LOCATIONS: Location[] = [{ name: "Rome", lat: 41.9028, lng: 12.4964 }];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeLocations, setActiveLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [mobileTab, setMobileTab] = useState<"chat" | "map">("chat");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  async function handleSave(content: string, locations: Location[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const title = content.split("\n")[0].replace(/\*+/g, "").trim().slice(0, 60);
    await supabase.from("itineraries").insert({ user_id: user.id, title, content, locations });
    alert("Itinerary saved!");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f4f4f5" }}>
      <Header />

      {/* Mobile tab switcher */}
      {isMobile && (
        <div style={{ display: "flex", borderBottom: "1px solid #e4e4e7", background: "#fff" }}>
          {(["chat", "map"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              style={{
                flex: 1, padding: "10px", fontSize: "13px", fontWeight: 600,
                fontFamily: "inherit", border: "none", cursor: "pointer", background: "transparent",
                borderBottom: mobileTab === tab ? "2px solid #18181b" : "2px solid transparent",
                color: mobileTab === tab ? "#18181b" : "#a1a1aa",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", textTransform: "capitalize",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {tab === "chat" ? "chat" : "map"}
              </span>
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, gap: isMobile ? 0 : "16px", padding: isMobile ? "12px" : "16px" }}>

        {/* Chat panel */}
        <div style={{
          width: isMobile ? "100%" : "30%",
          flexShrink: 0,
          display: isMobile && mobileTab !== "chat" ? "none" : "flex",
          flexDirection: "column",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e4e4e7",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <ChatPanel messages={messages} loading={loading} onSend={handleSend} />
        </div>

        {/* Map panel */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: isMobile && mobileTab !== "map" ? "none" : "block",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #e4e4e7",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          <MapView locations={activeLocations} />
        </div>

      </div>
    </div>
  );
}
