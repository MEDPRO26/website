"use client";

import { usePathname } from "next/navigation";
import { SupplierShell } from "@/components/dashboard/supplier-shell";

function isPublicPartnerRoute(pathname: string) {
  return (
    /^\/(supplier|prestataire)\/invite(\/|$)/.test(pathname) ||
    /^\/(supplier|prestataire)\/onboarding(\/|$)/.test(pathname)
  );
}

export function SupplierLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicPartnerRoute(pathname)) {
    return <div className="crm-app min-h-screen">{children}</div>;
  }

  return (
    <div className="crm-app">
      <SupplierShell>{children}</SupplierShell>
    </div>
  );
}
