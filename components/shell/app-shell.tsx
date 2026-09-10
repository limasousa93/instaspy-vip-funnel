"use client";

import { DesktopSidebar } from "./desktop-sidebar";
import { MobileTabBar } from "./mobile-tab-bar";
import { AccessTimerBanner } from "./access-timer-banner";

// O funil real do site começa em "/" (InstagramSpyFlow) e termina em
// "/[username]" (perfil com dados reais da Apify) — não há mais login.
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="pb-[5.75rem] lg:ml-64 lg:pb-0">{children}</main>
      <AccessTimerBanner />
      <MobileTabBar />
    </div>
  );
}
