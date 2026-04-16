"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const typeMessage = (text, callback) => {
    let i = 0;
    let current = "";

    const interval = setInterval(() => {
      current += text[i];
      i++;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = current;
        return updated;
      });

      if (i >= text.length) {
        clearInterval(interval);
        callback();
      }
    }, 15);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: "user", text: input },
      { role: "ai", text: "" } // ✅ placeholder added HERE
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: newMessages
        })
      });

      const data = await res.json();
      const reply = data.reply || "No reply";

      typeMessage(reply, () => setLoading(false));

    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "#0f172a",
      color: "#fff"
    }}>

      {/* HEADER */}
      <div style={{
        padding: "15px 20px",
        borderBottom: "1px solid #1e293b",
        display: "flex",
        alignItems: "center",
        background: "#020617"
      }}>
        <img
          src="/logo.png"
          alt="Marquey"
          style={{
            height: "60px",
            width: "auto",
            objectFit: "contain"
          }}
        />
      </div>

      {/* CHAT AREA */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        width: "100%"
      }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "15px"
            }}
          >
            <div style={{
              background: m.role === "user" ? "#2563eb" : "#1e293b",
              padding: "12px 16px",
              borderRadius: "12px",
              maxWidth: "75%",
              lineHeight: "1.6"
            }}>
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p style={{ marginBottom: "16px" }}>{children}</p>
                  ),
                  li: ({ children }) => (
                    <li style={{ marginBottom: "8px" }}>{children}</li>
                  )
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div style={{
        padding: "15px",
        borderTop: "1px solid #1e293b",
        display: "flex",
        gap: "10px",
        background: "#020617"
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // ✅ important
              sendMessage();
            }
          }}
          placeholder="Ask Marquey AI..."
          rows={2}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
            background: "#1e293b",
            color: "#fff",
            resize: "none"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
