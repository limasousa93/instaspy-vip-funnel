"use client";

import { useEffect, useState } from "react";

export function DebugErrorOverlay() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    function add(text: string) {
      setMessages((prev) => [...prev, text].slice(-8));
    }
    function onError(e: ErrorEvent) {
      add(`Error: ${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`);
    }
    function onRejection(e: PromiseRejectionEvent) {
      add(`Unhandled rejection: ${String(e.reason?.message ?? e.reason)}`);
    }
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    add(`Boot OK — UA: ${navigator.userAgent}`);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        maxHeight: "40vh",
        overflowY: "auto",
        background: "rgba(200,0,0,0.95)",
        color: "white",
        fontSize: 11,
        fontFamily: "monospace",
        padding: 8,
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
      }}
    >
      {messages.map((m, i) => (
        <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.3)", padding: "4px 0" }}>
          {m}
        </div>
      ))}
    </div>
  );
}
