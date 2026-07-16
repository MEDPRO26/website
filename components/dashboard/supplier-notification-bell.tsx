"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function SupplierNotificationBell() {
  const router = useRouter();
  const { canQuerySupplier } = useSupplierSession();
  const [open, setOpen] = useState(false);
  const seenIdsRef = useRef<Set<string> | null>(null);

  const unreadCount = useQuery(
    api.supplierNotifications.unreadCount,
    canQuerySupplier ? {} : "skip"
  );
  const notifications = useQuery(
    api.supplierNotifications.list,
    canQuerySupplier ? { limit: 15 } : "skip"
  );
  const markRead = useMutation(api.supplierNotifications.markRead);
  const markAllRead = useMutation(api.supplierNotifications.markAllRead);

  const count = unreadCount ?? 0;

  useEffect(() => {
    if (!notifications) return;

    if (seenIdsRef.current === null) {
      seenIdsRef.current = new Set(notifications.map((n) => n._id));
      return;
    }

    const fresh = notifications.filter(
      (n) => !n.read && !seenIdsRef.current!.has(n._id)
    );
    for (const n of notifications) {
      seenIdsRef.current.add(n._id);
    }

    for (const n of fresh) {
      toast.info(n.title, {
        description: n.description,
        action: n.link
          ? {
              label: "Voir",
              onClick: () => {
                router.push(n.link!);
              },
            }
          : undefined,
        duration: 8000,
      });
    }
  }, [notifications, router]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="relative text-muted-foreground"
          aria-label={`Notifications${count ? ` (${count} non lues)` : ""}`}
        >
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
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(100vw-2rem,22rem)] p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
          <p className="text-sm font-semibold">Notifications</p>
          {count > 0 ? (
            <Button
              size="sm"
              variant="ghost"
              className="h-auto px-2 py-1 text-xs"
              onClick={() => void markAllRead({})}
            >
              Tout marquer lu
            </Button>
          ) : null}
        </div>
        <div className="max-h-[min(70vh,22rem)] overflow-y-auto">
          {notifications === undefined ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Chargement…
            </p>
          ) : notifications.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Aucune notification pour l&apos;instant.
            </p>
          ) : (
            notifications.map((n) => {
              const content = (
                <div
                  className={cn(
                    "flex items-start gap-2.5 px-3 py-3 transition-colors",
                    !n.read ? "bg-brand-soft/40" : "hover:bg-muted/50"
                  )}
                >
                  <div
                    className={cn(
                      "mt-0.5 grid size-8 shrink-0 place-items-center rounded-full",
                      !n.read
                        ? "bg-brand text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Bell className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{n.title}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {n.timeLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {n.description}
                    </p>
                  </div>
                  {!n.read ? (
                    <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand" />
                  ) : null}
                </div>
              );

              if (n.link) {
                return (
                  <Link
                    key={n._id}
                    href={n.link}
                    onClick={() => {
                      if (!n.read) void markRead({ id: n._id });
                      setOpen(false);
                    }}
                    className="block border-b border-border/60 last:border-0"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  key={n._id}
                  type="button"
                  className="block w-full border-b border-border/60 text-left last:border-0"
                  onClick={() => {
                    if (!n.read) void markRead({ id: n._id });
                  }}
                >
                  {content}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
