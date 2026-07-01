import { Suspense } from "react";
import { AdminOrdersNewPage } from "@/components/crm/pages/admin-orders-new";

export default function AdminOrdersNewRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">Chargement du formulaire…</p>
        </div>
      }
    >
      <AdminOrdersNewPage />
    </Suspense>
  );
}
