import type { Metadata } from "next";

const title = "Soins et aide à domicile à Agadir | MediDomicile";
const description =
  "MediDomicile vous met en relation avec des infirmiers, aide-soignants et kinésithérapeutes qualifiés pour des soins à domicile à Agadir et au Maroc.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/services",
    languages: {
      "fr-MA": "/services",
      "x-default": "/services",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "/services",
    title,
    description,
    images: [
      {
        url: "/services/soins-domicile.jpg",
        width: 1200,
        height: 630,
        alt: "Professionnel de santé accompagnant une personne âgée à domicile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/services/soins-domicile.jpg"],
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
