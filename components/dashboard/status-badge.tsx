import { STATUS_LABEL, STATUS_TONE, type OrderStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TONE_CLASS: Record<string, string> = {
  info: "bg-info-soft text-info border-info/20",
  warning: "bg-warning-soft text-[color:oklch(0.45_0.13_60)] border-warning/30",
  success: "bg-success-soft text-success border-success/20",
  danger: "bg-danger-soft text-danger border-danger/20",
  brand: "bg-brand-soft text-brand-deep border-brand/20",
  neutral: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        TONE_CLASS[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Tag({
  tone = "neutral",
  children,
  className,
}: {
  tone?: "info" | "warning" | "success" | "danger" | "neutral" | "brand";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}