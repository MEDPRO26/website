import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { aideDomicilePillarContent } from "@/lib/aide-domicile-pillar-content";

export const metadata = buildLocationPillarMetadata(aideDomicilePillarContent);

export default function AideADomicilePage() {
  return <LocationPillarPage content={aideDomicilePillarContent} />;
}
