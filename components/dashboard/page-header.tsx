import type { ReactNode } from "react";

export function PageHeader({
  title, description, actions,
}: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-4 rounded-2xl border border-warning/30 bg-warning-soft/60 px-4 py-2.5 text-xs text-[color:oklch(0.40_0.13_60)]">
      Données de démonstration — destinées à illustrer l'interface uniquement.
    </div>
  );
}

export function EmptyState({
  icon: Icon, title, desc,
}: { icon: any; title: string; desc?: string }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-border/70 bg-card/50 px-6 py-12 text-center shadow-sm">
      <div className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground mb-3">
        <Icon className="size-6" />
      </div>
      <p className="text-sm font-medium text-foreground">{title}</p>
      {desc && <p className="mt-1 text-sm text-muted-foreground max-w-sm">{desc}</p>}
    </div>
  );
}