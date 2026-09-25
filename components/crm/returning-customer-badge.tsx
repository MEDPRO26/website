import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReturningCustomerBadge({
  priorOrdersCount,
  className,
  size = "md",
}: {
  priorOrdersCount?: number;
  className?: string;
  size?: "sm" | "md";
}) {
  const title =
    priorOrdersCount && priorOrdersCount > 0
      ? `Client récurrent · ${priorOrdersCount} commande${priorOrdersCount > 1 ? "s" : ""} passée${priorOrdersCount > 1 ? "s" : ""}`
      : "Client récurrent";

  return (
    <span
      title={title}
      aria-label="Client récurrent"
      className={cn(
        "grid place-items-center rounded-full bg-orange-500 text-white shadow-sm",
        size === "sm" ? "size-4" : "size-4 lg:size-5",
        className
      )}
    >
      <Undo2
        className={cn(
          "stroke-[2.5]",
          size === "sm" ? "size-2.5" : "size-2.5 lg:size-3"
        )}
      />
    </span>
  );
}
