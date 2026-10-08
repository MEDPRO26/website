import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { crmPageMetadata } from "@/lib/crm-metadata";
import "./crm.css";

export const metadata: Metadata = {
  ...crmPageMetadata("S2MBO"),
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "S2MBO Admin",
    statusBarStyle: "default",
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
