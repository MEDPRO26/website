import type { Metadata } from "next";
import { AdminShell } from "@/components/dashboard/app-shell";
import "./crm.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="crm-app">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
