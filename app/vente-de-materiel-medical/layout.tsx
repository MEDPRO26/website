import type { Metadata } from "next";
import { VENTE_PAGE_PATH } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Vente matériel médical | SOS Santé",
  description:
    "Achetez du matériel médical au Maroc : mobilité, respiratoire et confort. Catalogue complet avec livraison dans les grandes villes.",
  alternates: {
    canonical: VENTE_PAGE_PATH,
  },
  openGraph: {
    title: "Vente matériel médical | SOS Santé",
    description:
      "Catalogue de matériel médical à vendre : fauteuils roulants, concentrateurs d'oxygène, lits médicalisés et plus.",
    url: VENTE_PAGE_PATH,
    type: "website",
    locale: "fr_MA",
    siteName: "SOS Santé",
  },
};

export default function VenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
