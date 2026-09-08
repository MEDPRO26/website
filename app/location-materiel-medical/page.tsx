import LocationPillarPage, {
  buildLocationPillarMetadata,
} from "@/components/location-pillar-page";
import { locationPillarContent } from "@/lib/location-pillar-content";

export const metadata = buildLocationPillarMetadata(locationPillarContent);

export default function LocationMaterielMedicalPage() {
  return <LocationPillarPage content={locationPillarContent} />;
}
