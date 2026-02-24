"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Bot, Send, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Eduardo's AI assistant. Ask me anything about his skills, projects, or availability!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("Failed to get response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantContent,
            };
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble right now. Please try again or reach out to Eduardo directly!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[460px] rounded-2xl border border-border bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
        <Bot size={18} className="text-accent" />
        <span className="text-sm font-medium text-foreground">
          Ask my AI assistant
        </span>
        <span className="ml-auto w-2 h-2 rounded-full bg-accent animate-pulse" />
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-2.5 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div
              className={cn(
                "shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5",
                msg.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-accent-light text-accent"
              )}
            >
              {msg.role === "user" ? (
                <User size={14} />
              ) : (
                <Bot size={14} />
              )}
            </div>
            <div
              className={cn(
                "text-sm leading-relaxed rounded-2xl px-4 py-2.5",
                msg.role === "user"
                  ? "bg-foreground text-background rounded-tr-md"
                  : "bg-card border border-border rounded-tl-md"
              )}
            >
              {msg.content || (
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0.1s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0.2s]" />
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Eduardo..."
          disabled={loading}
          className="flex-1 text-sm bg-transparent text-foreground placeholder:text-muted/60 focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="p-2 rounded-full bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-40"
          aria-label="Send message"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
