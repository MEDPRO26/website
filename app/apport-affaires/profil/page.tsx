import { ApporteurPortalGate } from "@/components/crm/apporteur-portal-gate";
import { ApporteurProfilePage } from "@/components/crm/pages/apporteur-profile";

export default function ApporteurProfilRoute() {
  return (
    <ApporteurPortalGate>
      <ApporteurProfilePage />
    </ApporteurPortalGate>
  );
}
