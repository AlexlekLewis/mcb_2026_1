"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type Payload = Record<string, string | number | boolean | undefined>;

/**
 * Fires a single dataLayer/GA4 event when a server-rendered page mounts on
 * the client. Use for page-type-specific events that the EventTracker
 * page_view doesn't capture in detail (view_item, view_location, etc.).
 *
 * Mount once per page. Pass the event name and payload in.
 */
export function PageViewTracker({ event, payload }: { event: string; payload?: Payload }) {
  useEffect(() => {
    trackEvent(event, payload);
    // Intentionally empty deps — we only want this to fire once on mount per page navigation.
    // The page_view from EventTracker handles route changes; this fires alongside it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
