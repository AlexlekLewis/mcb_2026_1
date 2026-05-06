"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function EventTracker() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  useEffect(() => {
    if (isDashboard) return;

    trackEvent("page_view", {
      page_path: pathname || window.location.pathname,
    });
  }, [isDashboard, pathname]);

  useEffect(() => {
    if (isDashboard) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      if (href.startsWith("tel:")) {
        trackEvent("phone_tap", {
          source_path: window.location.pathname,
        });
        return;
      }

      const url = new URL(href, window.location.origin);
      const targetPath = url.pathname;

      if (targetPath === "/quote") {
        trackEvent("quote_cta_click", {
          source_path: window.location.pathname,
          has_product_context: url.searchParams.has("product"),
        });
        return;
      }

      if (isProductDiscoveryPath(targetPath)) {
        trackEvent("product_discovery_click", {
          source_path: window.location.pathname,
          target_path: targetPath,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isDashboard]);

  return null;
}

function isProductDiscoveryPath(pathname: string) {
  return (
    pathname.startsWith("/curtains") ||
    pathname.startsWith("/blinds") ||
    pathname.startsWith("/shutters") ||
    pathname.startsWith("/security") ||
    pathname.startsWith("/awnings") ||
    pathname.startsWith("/motorisation") ||
    pathname.startsWith("/products")
  );
}
