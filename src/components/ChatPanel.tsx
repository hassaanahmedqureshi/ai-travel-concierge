"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/lib/types";

type Props = {
  messages: Message[];
  loading: boolean;
  onSend: (message: string) => void;
};

export default function ChatPanel({ messages, loading, onSend }: Props) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input);
    setInput("");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%", overflow: "hidden", background: "#fafafa" }}>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "60px", color: "#a1a1aa" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#d4d4d8", display: "block", marginBottom: "12px" }}>travel_explore</span>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#52525b" }}>Where do you want to go?</p>
            <p style={{ fontSize: "12px", marginTop: "8px", lineHeight: 1.6 }}>Try: &quot;5 days in Sicily, budget traveler, love food and hiking&quot;</p>
          </div>
        )}

        {messages.map((m, i) => <MessageBubble key={i} message={m} />)}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: "16px", padding: "8px 12px", fontSize: "13px", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>flight_takeoff</span>
              Planning your trip...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ flexShrink: 0, borderTop: "1px solid #e4e4e7", padding: "12px 16px", background: "#fff" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your trip..."
            style={{ flex: 1, minWidth: 0, borderRadius: "999px", border: "1px solid #e4e4e7", background: "#f4f4f5", padding: "8px 16px", fontSize: "13px", outline: "none", fontFamily: "inherit" }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{ flexShrink: 0, borderRadius: "999px", background: "#18181b", color: "#fff", padding: "8px 16px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", opacity: loading || !input.trim() ? 0.4 : 1, fontFamily: "inherit" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>send</span>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
