import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { confortPillarContent } from "@/lib/confort-pillar-content";

export const metadata = buildLocationPillarMetadata(confortPillarContent);

export default function MaterielConfortMarocPage() {
  return <LocationPillarPage content={confortPillarContent} />;
}
