"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { capture } from "@/lib/tracking/utm";

/** PageView a cada troca de rota SPA; a primeira montagem é ignorada porque o `init` já dispara o primeiro PageView. */
function RouteChangePageView() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}

export function MetaPixel() {
  useEffect(() => {
    capture();

    const f = window as any;
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = document.createElement("script");
    t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    const s = document.getElementsByTagName("script")[0];
    s.parentNode?.insertBefore(t, s);
    f.fbq("init", "1680283033733135");
    f.fbq("track", "PageView");
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <RouteChangePageView />
      </Suspense>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src="https://www.facebook.com/tr?id=1680283033733135&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
    </>
  );
}
