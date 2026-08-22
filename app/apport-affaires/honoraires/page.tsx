import { ApporteurPortalGate } from "@/components/crm/apporteur-portal-gate";
import { ApporteurHonorairesPage } from "@/components/crm/pages/apporteur-honoraires";

export default function ApporteurHonorairesRoute() {
  return (
    <ApporteurPortalGate>
      <ApporteurHonorairesPage />
    </ApporteurPortalGate>
  );
}
