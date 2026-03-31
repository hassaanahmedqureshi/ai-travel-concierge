"use client";

import {useEffect, useRef, useState} from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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
    setLoading(false);
  }

  return (
       <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
         {/* Header */}
         <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
           <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
             ✈️ AI Travel Concierge
           </h1>
           <p className="text-sm text-zinc-500">
             Describe your trip and get a personalized itinerary
           </p>
         </header>

         {/* Messages */}
         <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-3xl w-full mx-auto">
           {messages.length === 0 && (
               <div className="text-center text-zinc-400 mt-20">
                 <p className="text-4xl mb-4">🌍</p>
                 <p className="text-lg font-medium">Where do you want to go?</p>
                 <p className="text-sm mt-1">
                   Try: `5 days in Sicily, budget traveler, love food and hiking`
                 </p>
               </div>
           )}

           {messages.map((message, index) => (
               <div
                   key={index}
                   className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
               >
                 <div
                     className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                         message.role === "user"
                             ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                             : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
                     }`}
                 >
                   {message.role === "user" ? (
                       message.content
                   ) : (
                       <ReactMarkdown
                           components={{
                             p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                             strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-50">{children}</strong>,
                             ul: ({ children }) => <ul className="space-y-1 my-2">{children}</ul>,
                             li: ({ children }) => <li className="flex gap-2"><span className="text-zinc-400">•</span><span>{children}</span></li>,
                           }}
                       >
                         {message.content}
                       </ReactMarkdown>
                   )}
                 </div>
               </div>
           ))}

           {loading && (
               <div className="flex justify-start">
                 <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-zinc-400">
                   Planning your trip...
                 </div>
               </div>
           )}

           <div ref={bottomRef} />
         </div>

         {/* Input */}
         <div className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-4">
           <form
               onSubmit={sendMessage}
               className="flex gap-2 max-w-3xl mx-auto"
           >
             <input
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Describe your trip..."
                 className="flex-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-400 dark:text-zinc-100"
             />
             <button
                 type="submit"
                 disabled={loading || !input.trim()}
                 className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2 text-sm font-medium disabled:opacity-40 hover:opacity-80 transition-opacity"
             >
               Send
             </button>
           </form>
         </div>
       </div>
  );
}