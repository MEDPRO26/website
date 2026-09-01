import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { SupplierLayoutClient } from "./supplier-layout-client";
import { crmPageMetadata } from "@/lib/crm-metadata";
import "./crm.css";

export const metadata: Metadata = {
  ...crmPageMetadata("S2MBO"),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "S2MBO",
    statusBarStyle: "default",
  },
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SupplierLayoutClient>{children}</SupplierLayoutClient>
      <Toaster richColors position="top-right" />
    </>
  );
}
