"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { InboxMobileHeader } from "@/components/messages/inbox-mobile-header";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationView } from "@/components/messages/conversation-view";
import { EmptyInboxState } from "@/components/messages/empty-inbox-state";
import { mockConversations } from "@/lib/mock-data/conversations";

const ACTIVE_CONVERSATION_KEY = "inbox:activeConversationId";

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [showLockedToast, setShowLockedToast] = useState(false);
  const active = mockConversations.find((c) => c.id === activeId) ?? null;

  // Restaura a conversa aberta após um refresh. Usa useLayoutEffect (roda
  // antes do browser pintar) e só libera o render real depois (`ready`) —
  // isso evita o flash de "lista -> conversa" que useEffect causaria, já
  // que ele só roda depois do primeiro paint.
  useLayoutEffect(() => {
    const savedId = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
    if (savedId && mockConversations.some((c) => c.id === savedId)) {
      // lê localStorage (indisponível no SSR) e precisa aplicar antes do
      // primeiro paint via useLayoutEffect; sem isso o refresh volta a
      // piscar lista -> conversa.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveId(savedId);
    }
    setReady(true);
  }, []);

  function selectConversation(id: string | null) {
    setActiveId(id);
    if (id) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    }
  }

  useEffect(() => {
    if (!showLockedToast) return;
    const timer = setTimeout(() => setShowLockedToast(false), 2200);
    return () => clearTimeout(timer);
  }, [showLockedToast]);

  if (!ready) {
    return <div className="inbox-viewport bg-background" />;
  }

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
            onSelect={selectConversation}
            onLockedSelect={() => setShowLockedToast(true)}
          />
        </div>
        {active ? (
          <ConversationView conversation={active} onBack={() => selectConversation(null)} />
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
