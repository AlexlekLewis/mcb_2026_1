import Link from "next/link";
import { Rocket, ArrowRight } from "lucide-react";

interface ReleaseTickerProps {
  lastReleaseTitle?: string;
  lastReleaseAgoLabel?: string;
  lastReleaseDeltaLabel?: string;
}

/**
 * One-line bottom-of-home strip pointing at the most recent release and its
 * headline result. Clicks through to /dashboard/releases.
 */
export function ReleaseTicker({
  lastReleaseTitle,
  lastReleaseAgoLabel,
  lastReleaseDeltaLabel,
}: ReleaseTickerProps) {
  if (!lastReleaseTitle) {
    return (
      <Link
        href="/dashboard/releases"
        className="group flex items-center justify-between gap-3 rounded-xl border border-dashed border-[var(--color-mcb-sand-deep)] px-5 py-3 text-sm text-[var(--color-mcb-warm-grey)] hover:bg-white transition-colors"
      >
        <span className="inline-flex items-center gap-2">
          <Rocket size={14} strokeWidth={1.75} aria-hidden="true" />
          No releases logged yet.
        </span>
        <span className="inline-flex items-center gap-1 text-[var(--color-mcb-terracotta-deep)] text-xs font-medium">
          Log one
          <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/dashboard/releases"
      className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-mcb-sand-deep)] bg-white px-5 py-3 text-sm transition-colors hover:bg-[var(--color-mcb-sand)]"
    >
      <span className="inline-flex items-center gap-3 min-w-0">
        <Rocket size={14} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-[var(--color-mcb-warm-grey)]" />
        <span className="text-[var(--color-mcb-warm-grey)] whitespace-nowrap text-xs">
          Last release · {lastReleaseAgoLabel}
        </span>
        <span className="truncate text-[var(--color-mcb-charcoal)]">
          &ldquo;{lastReleaseTitle}&rdquo;
        </span>
        {lastReleaseDeltaLabel && (
          <span className="whitespace-nowrap text-xs font-medium text-[var(--color-mcb-sage-dark)]">
            {lastReleaseDeltaLabel}
          </span>
        )}
      </span>
      <ArrowRight size={14} strokeWidth={2} aria-hidden="true" className="shrink-0 text-[var(--color-mcb-warm-grey)] group-hover:text-[var(--color-mcb-charcoal)]" />
    </Link>
  );
}
