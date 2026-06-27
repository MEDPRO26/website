"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Bell } from "lucide-react";

export function AdminNotificationsPage() {
  return (
    <div>
      <PageHeader title="Notifications" description="Centre des alertes plateforme" actions={<Button variant="outline">Tout marquer comme lu</Button>} />
      <div className="mb-4 flex gap-2 flex-wrap">
        {["Toutes", "Non lues", "Commandes", "Fournisseurs", "Réclamations", "Commissions"].map((f, i) => (
          <Button key={f} size="sm" variant={i === 0 ? "default" : "outline"}>{f}</Button>
        ))}
      </div>
      <Card className="divide-y divide-border p-0">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? "bg-brand-soft/30" : ""}`}>
            <div className={`mt-0.5 grid size-9 place-items-center rounded-full ${!n.read ? "bg-brand text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              <Bell className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium">{n.title}</p>
                <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.desc}</p>
            </div>
            {!n.read && <span className="mt-2 size-2 rounded-full bg-brand shrink-0" />}
          </div>
        ))}
      </Card>
    </div>
  );
}