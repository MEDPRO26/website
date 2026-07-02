import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import ConvexClientProvider from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { LOGO, SITE_URL_DEFAULT } from "@/lib/brand";
import { getRobotsMetadata } from "@/lib/indexing";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");
const siteName = "SOS Santé";
const title =
  "Location de matériel médical à Agadir et au Maroc | SOS Santé";
const description =
  "Louez du matériel médical à Agadir et partout au Maroc avec SOS Santé : lits médicalisés, fauteuils roulants, concentrateurs d'oxygène. Livraison, installation et désinfection incluses. Devis gratuit en 15 min.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title,
  description,
  keywords: [
    "location matériel médical Agadir",
    "location matériel médical Maroc",
    "matériel médical à domicile Agadir",
    "matériel médical à domicile Maroc",
    "lit médicalisé location Agadir",
    "fauteuil roulant location Agadir",
    "concentrateur oxygène location Agadir",
    "aide à domicile Agadir",
    "maintien à domicile Maroc",
    "location matelas anti escarres Agadir",
    "SOS Santé",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: "/",
    languages: {
      "fr-MA": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "/",
    siteName,
    title,
    description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SOS Santé, location de matériel médical et aide à domicile au Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
  robots: getRobotsMetadata(),
  category: "healthcare marketplace",
  icons: {
    icon: [
      { url: LOGO.favicon, sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: LOGO.apple,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html
        lang="fr-MA"
        className={`${plusJakartaSans.variable} ${sourceSerif4.variable} h-full antialiased`}
      >
        <head>
          {/* eslint-disable-next-line @next/next/no-page-custom-font */}
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="min-h-full flex flex-col font-sans">
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <MobileBottomNav />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
