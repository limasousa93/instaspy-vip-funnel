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
    function onRawClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      add(`Raw click reached document: <${target.tagName.toLowerCase()}> "${target.textContent?.slice(0, 30)}"`);
    }
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    document.addEventListener("click", onRawClick, true);
    add(`Boot OK — UA: ${navigator.userAgent}`);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      document.removeEventListener("click", onRawClick, true);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        maxHeight: "50vh",
        overflowY: "auto",
        background: "rgba(200,0,0,0.97)",
        color: "white",
        fontSize: 12,
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
