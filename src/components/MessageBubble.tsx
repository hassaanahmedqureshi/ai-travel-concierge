import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/types";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
        isUser
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 whitespace-pre-wrap"
          : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700"
      }`}>
        {isUser ? message.content : (
          <ReactMarkdown components={{
            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
            strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-zinc-50">{children}</strong>,
            ul: ({ children }) => <ul className="space-y-1 my-1.5">{children}</ul>,
            li: ({ children }) => <li className="flex gap-2"><span className="text-zinc-400">•</span><span>{children}</span></li>,
          }}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
