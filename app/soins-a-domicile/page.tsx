import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { soinsDomicilePillarContent } from "@/lib/soins-domicile-pillar-content";

export const metadata = buildLocationPillarMetadata(soinsDomicilePillarContent);

export default function SoinsADomicilePage() {
  return <LocationPillarPage content={soinsDomicilePillarContent} />;
}
