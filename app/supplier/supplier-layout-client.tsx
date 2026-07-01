"use client";

import { usePathname } from "next/navigation";
import { SupplierShell } from "@/components/dashboard/app-shell";

function isPublicSupplierRoute(pathname: string) {
  return (
    pathname.startsWith("/supplier/invite") ||
    pathname.startsWith("/supplier/onboarding")
  );
}

export function SupplierLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isPublicSupplierRoute(pathname)) {
    return <div className="crm-app min-h-screen">{children}</div>;
  }

  return (
    <div className="crm-app">
      <SupplierShell>{children}</SupplierShell>
    </div>
  );
}
