import type { Metadata } from "next";
import { SupplierShell } from "@/components/dashboard/app-shell";
import "./crm.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="crm-app">
      <SupplierShell>{children}</SupplierShell>
    </div>
  );
}
