import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { mobilitePillarContent } from "@/lib/mobilite-pillar-content";

export const metadata = buildLocationPillarMetadata(mobilitePillarContent);

export default function MaterielMobiliteMarocPage() {
  return <LocationPillarPage content={mobilitePillarContent} />;
}
