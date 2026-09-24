import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { InteractionsProvider } from "@/lib/context/interactions-context";
import { VipModalProvider } from "@/lib/context/vip-modal-context";
import { SessionProvider } from "@/lib/context/session-context";
import { SESSION_COOKIE_NAME, verifySession } from "@/lib/session/session";
import { MetaPixel } from "@/components/meta-pixel";

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
  other: {
    "facebook-domain-verification": "86miwo7f44qy1d0xak109qnu9h9wi2",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const session = await verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);

  return (
    <html
      lang="pt-BR"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        <MetaPixel />
        <SessionProvider
          value={{
            hasVipAccess: session?.vip ?? false,
            hasUpsellAccess: session?.upsell ?? false,
            hasDownsellAccess: session?.downsell ?? false,
            hasCrossellAccess: session?.crossell ?? false,
          }}
        >
          <AuthProvider>
            <InteractionsProvider>
              <VipModalProvider>{children}</VipModalProvider>
            </InteractionsProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
