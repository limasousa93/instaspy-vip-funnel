"use client";

import { useState } from "react";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationView } from "@/components/messages/conversation-view";
import { EmptyInboxState } from "@/components/messages/empty-inbox-state";
import { mockConversations } from "@/lib/mock-data/conversations";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = mockConversations.find((c) => c.id === activeId) ?? null;

  return (
    <div className="flex h-[calc(100vh-56px)] lg:h-screen">
      <div className={active ? "hidden lg:block" : "block w-full lg:w-auto"}>
        <ConversationList conversations={mockConversations} activeId={activeId} onSelect={setActiveId} />
      </div>
      {active ? (
        <ConversationView conversation={active} onBack={() => setActiveId(null)} />
      ) : (
        <EmptyInboxState />
      )}
    </div>
  );
}
