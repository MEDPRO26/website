import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { SupplierLayoutClient } from "./supplier-layout-client";
import { getPrivateRobotsMetadata } from "@/lib/indexing";
import "./crm.css";

export const metadata: Metadata = {
  robots: getPrivateRobotsMetadata(),
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SupplierLayoutClient>{children}</SupplierLayoutClient>
      <Toaster richColors position="top-right" />
    </>
  );
}
