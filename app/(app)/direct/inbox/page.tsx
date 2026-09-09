"use client";

import { useEffect, useState } from "react";
import { InboxMobileHeader } from "@/components/messages/inbox-mobile-header";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationView } from "@/components/messages/conversation-view";
import { EmptyInboxState } from "@/components/messages/empty-inbox-state";
import { mockConversations } from "@/lib/mock-data/conversations";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showLockedToast, setShowLockedToast] = useState(false);
  const active = mockConversations.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (!showLockedToast) return;
    const timer = setTimeout(() => setShowLockedToast(false), 2200);
    return () => clearTimeout(timer);
  }, [showLockedToast]);

  return (
    <div className="inbox-viewport relative flex flex-col lg:h-screen">
      <div className={active ? "hidden lg:block" : "block lg:hidden"}>
        <InboxMobileHeader />
      </div>
      <div className="flex min-h-0 flex-1">
        <div className={active ? "hidden lg:block" : "block w-full overflow-y-auto lg:w-auto lg:overflow-visible"}>
          <ConversationList
            conversations={mockConversations}
            activeId={activeId}
            onSelect={setActiveId}
            onLockedSelect={() => setShowLockedToast(true)}
          />
        </div>
        {active ? (
          <ConversationView conversation={active} onBack={() => setActiveId(null)} />
        ) : (
          <EmptyInboxState />
        )}
      </div>
      {showLockedToast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg">
            Não é possível abrir esta conversa
          </div>
        </div>
      )}
    </div>
  );
}
