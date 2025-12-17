"use client";
import { useState, useEffect, useRef } from "react";
import TypingMessage from "./components/TypingMessage";
import LoadingDots from "./components/LoadingDots";
import "../chat/font.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [typingDone, setTypingDone] = useState(false);   // 🔥 NEW
  const [followUpCount, setFollowUpCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const bottomRef = useRef(null);
  const maxFollowUp = 3;

  useEffect(() => {
  const timer = setTimeout(() => {
    setShowSuggestions(true);
  }, 1000); // ⏱ 1.5 seconds

  return () => clearTimeout(timer);
}, []);


  // COMMON SUGGESTIONS
  const commonSuggestions = 
  [
    "Best places to visit in India?",
    "Give me a 5-day travel plan.",
    "Where should I go in winter in India?",
    "Family-friendly hotels nearby?"
  ];

  // FOLLOW UP SUGGESTION SETS
  const suggestionSets = {
    hotels: [
      "Show me hotels in that city",
      "Budget-friendly hotels?",
      "Luxury stays nearby"
    ],
    food: [
      "Any local food recommendations?",
      "Best places to eat?",
      "Street food suggestions?"
    ],
    travelInfo: [
      "Best time to visit?",
      "How to reach there?",
      "Weather details?"
    ]
  };
    const suggestionGroups = [
    suggestionSets.hotels,
    suggestionSets.food,
    suggestionSets.travelInfo
  ];

   const currentSuggestions =
    suggestionGroups[followUpCount % suggestionGroups.length];

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // WELCOME MESSAGE ONCE
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "👋 Hi! I’m your AI Assistant.\n\nI can help you with:\n• Best places to visit\n• Custom itineraries\n• Hotels & stays\n• Local food & tips\n\nAsk anything to get started!"
        }
      ]);
    }
  }, []);

  // SEND MESSAGE
  async function sendMessage(messageText) {
    const text = messageText || input;
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    const history = messages.map(m => ({
      role: m.role,
      content: m.content
    }));

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    setMessages(prev => [...prev, { role: "assistant", content: "" }]);
    setIsLoading(true);
    setIsStreaming(true);
    setTypingDone(false);     // 🔥 RESET TYPING DONE

    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(n => n.trim() !== "");

      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          const token = json?.choices?.[0]?.delta?.content;

          if (token) {
            accumulated += token;

            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1].content = accumulated;
              return updated;
            });
          }
        } catch {}
      }
    }

    setIsLoading(false);
    setIsStreaming(false);
  }

 return (
  <div
    style={{
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      color: "white",
      padding: "12px",
      boxSizing: "border-box",
      fontFamily: "Text_Font",
        backgroundcolor:"transparent",
    }}
  >
    <h1
      style={{
        textAlign: "left",
        fontFamily: "Title_Font",
        fontSize: "clamp(40px, 5vw, 62px)",
        // background: "linear-gradient(to bottom,#1e3c72,#2a5298)",
        WebkitBackgroundClip: "text",
        color: "white",
        backgroundcolor:"transparent",
        // borderRadius:"15px"
        
      }}
    >
      AI Assistant
    </h1>

    <div
      style={{
        flex: 1,
        overflowY: "auto",
        paddingRight: 10
      }}
    >
      {/* COMMON SUGGESTIONS */}

      {/* CHAT MESSAGES */}
      {messages.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
            fontSize: "clamp(12px, 3vw, 14px)"

          }}
        >
          <div
            style={{
              maxWidth: "85%",
              padding: "10px 14px",
              borderRadius: 14,
              background: m.role === "user" ? "#f7d488ff" : "#F4EAD5",
              color: "#000",
              whiteSpace: "pre-wrap"
            }}
          >
            {m.role === "assistant" ? (
              <TypingMessage
                text={m.content}
                onDone={() => setTypingDone(true)}
              />
            ) : (
              m.content
            )}
          </div>
        </div>
      ))}
  
        {showSuggestions && (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {commonSuggestions.map((q, i) => (
        <button
          key={i}
          onClick={() => {
            setShowSuggestions(false),
            sendMessage(q)
          }}
          style={{
            padding: "10px 15px",
            borderRadius: 8,
            background: "#fcf5e8ff",
            border: "1px solid #1e1e1e6a",
            cursor: "pointer",
            fontSize: "clamp(12px, 3vw, 14px)",
          }}
        >
          {q}
        </button>
      ))}
    </div>
  </div>
)}


      {isLoading && (
        <div style={{ display: "flex", marginBottom: 10 }}>
          <div
            style={{
              background: "#F4EAD5",
              padding: "10px 14px",
              borderRadius: 14
            }}
          >
            <LoadingDots />
          </div>
        </div>
      )}

      <div ref={bottomRef}></div>

      {/* FOLLOW UP */}
      {messages.length > 1 &&
        !isLoading &&
        !isStreaming &&
        typingDone &&
        messages[messages.length - 1].role === "assistant" &&
        followUpCount < maxFollowUp && (
          <div
            style={{
              margin: "15px 0",
              display: "flex",
              flexWrap: "wrap",
              gap: 10
            }}
          >
            {commonSuggestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  sendMessage(q);
                  setFollowUpCount(followUpCount + 1);
                }}
                style={{
                  padding: "10px 15px",
                  borderRadius: 8,
                  background: "#fcf5e8ff",
                  border: "1px solid #1e1e1e6a",
                  cursor: "pointer",
                  fontSize: "clamp(12px, 3vw, 14px)"
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
    </div>

    {/* FIXED INPUT BAR */}
    <div
      style={{
        position: "sticky",
        bottom: 0,
        backgroundcolor:"transparent",
        padding: "10px 0"
      }}
    >
      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about travel..."
          style={{
            flex: 1,
            padding: 10,
            border: "1px solid #ccc",
            borderRadius: 8
          }}
        />
        <button
          onClick={() => sendMessage()}
          style={{
            padding: "10px 14px",
            marginLeft: 10,
            borderRadius: 8,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  </div>
);
}