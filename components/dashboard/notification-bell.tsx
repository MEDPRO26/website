"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { Bell } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { canQueryAdmin } = useAdminSession();
  const unreadCount = useQuery(
    api.notifications.unreadCount,
    canQueryAdmin ? {} : "skip"
  );

  const count = unreadCount ?? 0;

  return (
    <Button size="icon" variant="ghost" className="relative" asChild>
      <Link href="/admin/notifications" aria-label={`Notifications${count ? ` (${count} non lues)` : ""}`}>
        <Bell className="size-5" />
        {count > 0 ? (
          <span
            className={cn(
              "absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-[var(--danger)] px-1 text-[10px] font-bold leading-none text-white",
              count > 9 ? "h-[18px]" : "size-[18px]"
            )}
          >
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
