import type { Metadata } from "next";
import { StaffLoginPage } from "@/components/crm/staff-login-page";
import { getPrivateRobotsMetadata } from "@/lib/indexing";
import "@/app/admin/crm.css";

export const metadata: Metadata = {
  title: "Espace fournisseurs",
  robots: getPrivateRobotsMetadata(),
};

export default function FournisseursLoginPage() {
  return <StaffLoginPage audience="supplier" />;
}
