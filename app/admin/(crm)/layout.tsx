"use client";

import { AdminShell } from "@/components/dashboard/app-shell";

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="crm-app">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
