import ParVillePillarPage, {
  buildParVillePillarMetadata,
} from "@/components/par-ville-pillar-page";
import { parVillePillarContent } from "@/lib/par-ville-pillar-content";

export const metadata = buildParVillePillarMetadata(parVillePillarContent);

export default function MaterielMedicalParVillePage() {
  return <ParVillePillarPage content={parVillePillarContent} />;
}
