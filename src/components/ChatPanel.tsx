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
    <div className="flex flex-col w-[400px] flex-shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-zinc-400 mt-16 px-4">
            <p className="text-3xl mb-3">🌍</p>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Where do you want to go?</p>
            <p className="text-xs mt-2 text-zinc-400 leading-relaxed">
              Try: "5 days in Sicily, budget traveler, love food and hiking"
            </p>
          </div>
        )}

        {messages.map((m, i) => <MessageBubble key={i} message={m} />)}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-3 py-2 text-sm text-zinc-400 flex items-center gap-2">
              <span className="animate-pulse">✈️</span> Planning your trip...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-3 py-3 bg-white dark:bg-zinc-900">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your trip..."
            className="flex-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:text-zinc-100 placeholder:text-zinc-400"
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
  );
}
