import ReactMarkdown from "react-markdown";
import { Message } from "@/lib/types";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", width: "100%" }}>
      <div style={{
        maxWidth: "85%",
        borderRadius: "16px",
        padding: "8px 12px",
        fontSize: "13px",
        lineHeight: 1.6,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
        background: isUser ? "#18181b" : "#fff",
        color: isUser ? "#fff" : "#3f3f46",
        border: isUser ? "none" : "1px solid #e4e4e7",
      }}>
        {isUser ? message.content : (
          <ReactMarkdown components={{
            p: ({ children }) => <p style={{ marginBottom: "6px" }}>{children}</p>,
            strong: ({ children }) => <strong style={{ fontWeight: 700, color: "#18181b" }}>{children}</strong>,
            ul: ({ children }) => <ul style={{ margin: "6px 0" }}>{children}</ul>,
            li: ({ children }) => <li style={{ marginBottom: "4px", paddingLeft: "12px" }}>• {children}</li>,
          }}>
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
