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
    <Card className="p-5 transition-shadow hover:shadow-[0_2px_8px_rgba(15,23,42,0.06),0_12px_32px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground truncate">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <div className={cn("grid size-10 shrink-0 place-items-center rounded-2xl", toneBg[tone])}>
            <Icon className="size-5" />
          </div>
        )}
      </div>
    </Card>
  );
}