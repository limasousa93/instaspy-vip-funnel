"use client";

import { useEffect, useState } from "react";
import { InboxMobileHeader } from "@/components/messages/inbox-mobile-header";
import { ConversationList } from "@/components/messages/conversation-list";
import { ConversationView } from "@/components/messages/conversation-view";
import { EmptyInboxState } from "@/components/messages/empty-inbox-state";
import { mockConversations } from "@/lib/mock-data/conversations";

export default function InboxPage() {
  // Sempre abre na lista de conversas — ao sair da rota (mobile tab bar,
  // sidebar) e voltar, a página remonta do zero, então nunca restaura uma
  // conversa aberta automaticamente. Só entra em uma conversa por clique.
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = mockConversations.find((c) => c.id === activeId) ?? null;

  function selectConversation(id: string | null) {
    setActiveId(id);
  }

  // Mesmo fallback usado em reels/page.tsx: no iOS Safari, 100dvh pode ficar
  // um passo atrás enquanto a barra de endereço colapsa durante um scroll
  // sustentado — visualViewport.height é o que o Safari realmente mantém
  // atualizado em tempo real (ver .inbox-viewport em globals.css).
  useEffect(() => {
    function setAppVh() {
      const height = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty("--app-vh", `${height * 0.01}px`);
    }
    setAppVh();
    window.addEventListener("resize", setAppVh);
    window.visualViewport?.addEventListener("resize", setAppVh);
    window.visualViewport?.addEventListener("scroll", setAppVh);
    return () => {
      window.removeEventListener("resize", setAppVh);
      window.visualViewport?.removeEventListener("resize", setAppVh);
      window.visualViewport?.removeEventListener("scroll", setAppVh);
    };
  }, []);

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
          />
        </div>
        {active ? (
          <ConversationView conversation={active} onBack={() => selectConversation(null)} />
        ) : (
          <EmptyInboxState />
        )}
      </div>
    </div>
  );
}
