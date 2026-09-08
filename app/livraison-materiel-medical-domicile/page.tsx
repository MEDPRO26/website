import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { livraisonPillarContent } from "@/lib/livraison-pillar-content";

export const metadata = buildLocationPillarMetadata(livraisonPillarContent);

export default function LivraisonMaterielMedicalDomicilePage() {
  return <LocationPillarPage content={livraisonPillarContent} />;
}
