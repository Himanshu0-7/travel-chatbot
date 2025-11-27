"use client";
import { useState, useEffect, useRef } from "react";
import TypingMessage from "./components/TypingMessage";
import LoadingDots from "./components/LoadingDots";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);

  const suggested = [
    "Best places to visit in Sambalpur?",
    "Give me a 5-day travel plan.",
    "Where should I go in winter?",
    "Places to visit near me?"
  ];

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendMessage(messageText) {
    const text = messageText || input;
    if (!text) return;

    setMessages(prev => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    setIsLoading(false);

    setMessages(prev => [
      ...prev,
      { role: "assistant", content: data.reply }
    ]);
  }

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "auto", padding: 20 }}>
      <h1>Travel Chatbot</h1>

      {/* Suggested buttons */}
      <div style={{ marginBottom: 20 }}>
        <h3>Suggested Questions:</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {suggested.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              style={{
                padding: "10px 15px",
                borderRadius: 8,
                background: "#fcf5e8ff",
                border: "1px solid #1e1e1e6a",
                cursor: "pointer"
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: "12px"
          }}
        >
          <div
            style={{
              maxWidth: "75%",
              padding: "10px 14px",
              borderRadius: "14px",
              background: m.role === "user" ? "#f7d488ff" : "#F4EAD5",
              color: "#000",
              fontSize: "15px",
              lineHeight: "1.4",
              whiteSpace: "pre-wrap"
            }}
          >
            {m.role === "assistant" ? (
              <TypingMessage text={m.content} />
            ) : (
              m.content
            )}
          </div>
        </div>
      ))}

      {/* Loading dots while waiting */}
      {isLoading && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 10
          }}
        >
          <div
            style={{
              background: "#F4EAD5",
              padding: "10px 14px",
              borderRadius: "14px",
              maxWidth: "75%"
            }}
          >
            <LoadingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>

      {/* Input */}
      <div style={{ display: "flex", marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about travel..."
          style={{
            width: "80%",
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        />
        <button
          onClick={() => sendMessage()}
          style={{
            padding: 10,
            marginLeft: 10,
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
