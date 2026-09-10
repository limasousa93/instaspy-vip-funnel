import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { InteractionsProvider } from "@/lib/context/interactions-context";
import { VipModalProvider } from "@/lib/context/vip-modal-context";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Instagram Clone (Study Project)",
  description: "Réplica de estudo da interface do Instagram — projeto educacional.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <InteractionsProvider>
            <VipModalProvider>{children}</VipModalProvider>
          </InteractionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
