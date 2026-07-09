"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const SUPPLIER_RESPONSE_DEADLINE_MS = 30 * 60 * 1000;

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function isSupplierResponseExpired(assignedAt: number) {
  return Date.now() - assignedAt >= SUPPLIER_RESPONSE_DEADLINE_MS;
}

export function SupplierResponseCountdown({
  assignedAt,
  size = "sm",
  className,
  onExpire,
}: {
  assignedAt: number;
  size?: "sm" | "lg";
  className?: string;
  onExpire?: () => void;
}) {
  const deadline = assignedAt + SUPPLIER_RESPONSE_DEADLINE_MS;
  const [remaining, setRemaining] = useState(() => deadline - Date.now());

  useEffect(() => {
    const tick = () => {
      const next = deadline - Date.now();
      setRemaining(next);
      if (next <= 0) {
        onExpire?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline, onExpire]);

  const expired = remaining <= 0;
  const urgent = !expired && remaining < 5 * 60 * 1000;
  const isLarge = size === "lg";

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-mono font-bold tabular-nums",
        isLarge ? "px-4 py-2.5 text-xl sm:text-lg" : "rounded-full px-2 py-0.5 text-[11px]",
        expired
          ? "bg-status-error/10 text-status-error"
          : urgent
            ? "animate-pulse bg-status-error/10 text-status-error"
            : "bg-warning-soft text-warning",
        className
      )}
      title="Temps restant pour répondre (30 min)"
    >
      <Clock className={cn("shrink-0", isLarge ? "size-5" : "size-3")} />
      {expired ? "00:00" : formatRemaining(remaining)}
    </span>
  );
}
