import type { Metadata } from "next";
import { SupplierLayoutClient } from "./supplier-layout-client";
import "./crm.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  return <SupplierLayoutClient>{children}</SupplierLayoutClient>;
}
