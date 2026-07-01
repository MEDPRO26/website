import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { getPrivateRobotsMetadata } from "@/lib/indexing";
import "./crm.css";

export const metadata: Metadata = {
  robots: getPrivateRobotsMetadata(),
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
