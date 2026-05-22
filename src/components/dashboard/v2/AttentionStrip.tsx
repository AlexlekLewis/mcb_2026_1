import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export interface AttentionItem {
  id: string;
  message: ReactNode;
  href?: string;
}

interface AttentionStripProps {
  items: AttentionItem[];
}

/**
 * Inline alert strip on Home. Only renders if there are items. Designed to
 * be ignorable when there's nothing to act on, and prominent when there is.
 *
 * Visual weight: clay-tinted background, terracotta left bar. Inside the
 * warm palette — alarming without being jarring.
 */
export function AttentionStrip({ items }: AttentionStripProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-labelledby="attention-heading"
      className="rounded-xl border-l-[4px] border-[var(--color-mcb-terracotta)] bg-[#F4E6D7]/40 px-5 py-4"
    >
      <h2 id="attention-heading" className="sr-only">
        Items needing attention
      </h2>
      <div className="flex items-start gap-3">
        <AlertTriangle
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--color-mcb-terracotta-deep)]"
        />
        <ul className="flex-1 space-y-1.5 text-sm text-[var(--color-mcb-charcoal)]">
          {items.slice(0, 5).map((item) => (
            <li key={item.id}>
              {item.href ? (
                <a
                  href={item.href}
                  className="hover:underline underline-offset-2 decoration-[var(--color-mcb-terracotta)]/40"
                >
                  {item.message}
                </a>
              ) : (
                item.message
              )}
            </li>
          ))}
          {items.length > 5 && (
            <li className="text-xs text-[var(--color-mcb-warm-grey)]">
              + {items.length - 5} more
            </li>
          )}
        </ul>
      </div>
    </section>
  );
}
