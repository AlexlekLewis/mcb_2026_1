import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  meta?: string;
}

export function PageHeader({ title, subtitle, actions, meta }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--color-mcb-sand-deep)] pb-6">
      <div className="min-w-0">
        <h1 className="font-serif text-3xl font-medium leading-tight text-[var(--color-mcb-charcoal)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1.5 text-sm text-[var(--color-mcb-warm-grey)]">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {meta && (
          <span className="text-xs text-[var(--color-mcb-warm-grey)] tabular-nums">{meta}</span>
        )}
        {actions}
      </div>
    </header>
  );
}
