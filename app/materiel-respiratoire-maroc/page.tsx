import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { respiratoirePillarContent } from "@/lib/respiratoire-pillar-content";

export const metadata = buildLocationPillarMetadata(respiratoirePillarContent);

export default function MaterielRespiratoireMarocPage() {
  return <LocationPillarPage content={respiratoirePillarContent} />;
}
