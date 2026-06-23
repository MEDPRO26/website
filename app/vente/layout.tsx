import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vente matériel médical | SOS Santé",
  description:
    "Achetez du matériel médical au Maroc : mobilité, respiratoire et confort. Catalogue complet avec livraison dans les grandes villes.",
  alternates: {
    canonical: "/vente",
  },
  openGraph: {
    title: "Vente matériel médical | SOS Santé",
    description:
      "Catalogue de matériel médical à vendre : fauteuils roulants, concentrateurs d'oxygène, lits médicalisés et plus.",
    url: "/vente",
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
