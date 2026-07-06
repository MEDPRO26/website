import { Suspense } from "react";
import { AdminConversationsPage } from "@/components/crm/pages/admin-conversations";

export default function AdminConversationsRoute() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-muted-foreground">Chargement…</p>}>
      <AdminConversationsPage />
    </Suspense>
  );
}
