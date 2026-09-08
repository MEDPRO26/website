import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { ventePillarContent } from "@/lib/vente-pillar-content";

export const metadata = buildLocationPillarMetadata(ventePillarContent);

export default function VenteMaterielMedicalMarocPage() {
  return <LocationPillarPage content={ventePillarContent} />;
}
