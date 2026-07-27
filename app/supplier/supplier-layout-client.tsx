"use client";

import { usePathname } from "next/navigation";
import { SupplierShell } from "@/components/dashboard/supplier-shell";
import { partnerPortalBaseFromPath } from "@/lib/auth-routes";

function isPublicPartnerRoute(pathname: string) {
  const base = partnerPortalBaseFromPath(pathname);
  return (
    pathname.startsWith(`${base}/invite`) ||
    pathname.startsWith(`${base}/onboarding`)
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
