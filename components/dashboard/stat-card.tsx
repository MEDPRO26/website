import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label, value, icon: Icon, hint, tone = "neutral",
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  tone?: "neutral" | "brand" | "success" | "warning" | "danger" | "info";
}) {
  const toneBg: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground",
    brand: "bg-brand-soft text-brand-deep",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-[color:oklch(0.45_0.13_60)]",
    danger: "bg-danger-soft text-danger",
    info: "bg-info-soft text-info",
  };
  return (
    <Card className="border-0 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_2px_8px_rgba(15,23,42,0.06),0_12px_32px_rgba(15,23,42,0.08)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold leading-snug text-foreground sm:text-sm">{label}</p>
          <p className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:mt-2 sm:text-3xl">{value}</p>
          {hint ? (
            <p className="mt-1 text-[11px] leading-snug text-muted-foreground sm:mt-1.5 sm:text-xs sm:leading-relaxed">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <div className={cn("grid size-10 shrink-0 place-items-center rounded-2xl sm:size-11", toneBg[tone])}>
            <Icon className="size-[18px] sm:size-5" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}