"use client";

import { useState, useRef, useEffect } from "react";
import { AIResponse } from "@/lib/types";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  response?: AIResponse;
};

const exampleQuestions = [
  "I have salary income and donations. Which product should I use?",
  "I am a freelancer with home-office expenses. Can I use Free?",
  "I own an incorporated company with no revenue. What should I choose?",
  "I have investment income and rental income. Which product fits me?",
  "What is the difference between Premier and Self-Employed?",
  "I want someone else to file for me. What should I select?",
];

let idCounter = 0;

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: idCounter++,
      role: "assistant",
      content:
        "Hello! I am the TaxAdvisor AI assistant. I can help you choose the right tax software product based on your situation. Ask me about income sources, deductions, or product differences — and I will provide guidance based on our product rules.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(question: string) {
    if (!question.trim() || loading) return;

    const userMsg: Message = { id: idCounter++, role: "user", content: question.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() }),
      });
      const data: AIResponse = await res.json();

      const assistantMsg: Message = {
        id: idCounter++,
        role: "assistant",
        content: data.answer,
        response: data,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: idCounter++,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">AI Assistant</h1>
          <p className="text-gray-500 text-sm mt-1">
            Ask product-selection questions. Answers are based on our product rules.
          </p>
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-y-auto p-4 flex flex-col gap-4 mb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm"
                }`}
              >
                <p>{msg.content}</p>

                {msg.response?.recommendedProduct && (
                  <div className="mt-2 pt-2 border-t border-gray-200/50">
                    <span className="font-semibold">Suggested product: </span>
                    <span className="font-bold">{msg.response.recommendedProduct}</span>
                    {msg.response.confidence && (
                      <span className="ml-2 text-xs opacity-75">({msg.response.confidence} confidence)</span>
                    )}
                  </div>
                )}

                {msg.response?.reasons && msg.response.reasons.length > 0 && (
                  <ul className="mt-2 text-xs opacity-80 space-y-0.5">
                    {msg.response.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="shrink-0">&#8250;</span> {r}
                      </li>
                    ))}
                  </ul>
                )}

                {msg.response?.disclaimer && (
                  <p className="mt-2 text-xs opacity-60 border-t border-gray-200/40 pt-2">
                    {msg.response.disclaimer}
                  </p>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Example Questions */}
        {messages.length === 1 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 font-medium mb-2">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.slice(0, 4).map((q) => (
                // <button
                //   key={q}
                //   onClick={() => sendMessage(q)}
                //   className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                // >
                //   {q.length > 50 ? q.slice(0, 50) + "…" : q}
                // </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about income sources, deductions, or products..."
            maxLength={1000}
            disabled={loading}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-2 text-center">
          This assistant provides general product guidance only and is not tax, legal, or financial advice.
        </p>
      </div>
    </div>
  );
}
