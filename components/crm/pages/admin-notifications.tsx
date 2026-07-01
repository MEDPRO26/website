"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Bell } from "lucide-react";

const FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "unread", label: "Non lues" },
  { key: "order", label: "Commandes" },
  { key: "supplier", label: "Fournisseurs" },
  { key: "complaint", label: "Réclamations" },
  { key: "commission", label: "Commissions" },
] as const;

export function AdminNotificationsPage() {
  const { canQueryAdmin } = useAdminSession();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);

  const notifications = useQuery(
    api.notifications.list,
    canQueryAdmin
      ? {
          unreadOnly: filter === "unread" ? true : undefined,
          type:
            filter === "order" ||
            filter === "supplier" ||
            filter === "complaint" ||
            filter === "commission"
              ? filter
              : undefined,
        }
      : "skip"
  );

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Centre des alertes plateforme"
        actions={
          <Button variant="outline" onClick={() => void markAllRead()}>
            Tout marquer comme lu
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((item) => (
          <Button
            key={item.key}
            size="sm"
            variant={filter === item.key ? "default" : "outline"}
            onClick={() => setFilter(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <Card className="divide-y divide-border p-0">
        {notifications === undefined ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Chargement…</p>
        ) : notifications.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Aucune notification pour l&apos;instant. Elles apparaîtront lors des
            nouvelles commandes, prix fournisseur et offres.
          </p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`flex items-start gap-3 p-4 ${!n.read ? "bg-brand-soft/30" : ""}`}
            >
              <div
                className={`mt-0.5 grid size-9 place-items-center rounded-full ${!n.read ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Bell className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  {n.link ? (
                    <Link href={n.link} className="text-sm font-medium hover:underline">
                      {n.title}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium">{n.title}</p>
                  )}
                  <span className="shrink-0 text-xs text-muted-foreground">{n.timeLabel}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
                {!n.read ? (
                  <Button
                    size="sm"
                    variant="link"
                    className="mt-1 h-auto p-0"
                    onClick={() => void markRead({ id: n._id })}
                  >
                    Marquer comme lu
                  </Button>
                ) : null}
              </div>
              {!n.read ? <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
