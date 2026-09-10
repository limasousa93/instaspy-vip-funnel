"use client";

import { DesktopSidebar } from "./desktop-sidebar";
import { MobileTabBar } from "./mobile-tab-bar";
import { AccessTimerBanner } from "./access-timer-banner";

// O funil de entrada ("/" e "/buscar", OnboardingFlow) fica fora deste
// shell de propósito — termina redirecionando pra "/feed", que é a
// primeira tela com a navegação real do site (sidebar/tab bar/timer).
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
