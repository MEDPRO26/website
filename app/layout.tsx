import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BottomNavRoot } from "@/components/bottom-nav-root";
import ConvexClientProvider from "@/components/convex-client-provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { LOGO, HOMEPAGE_OG_ALT, HOMEPAGE_OG_IMAGE, SITE_DISPLAY_NAME, SITE_URL_DEFAULT } from "@/lib/brand";
import { getRobotsMetadata } from "@/lib/indexing";
import GlobalSiteJsonLd from "@/components/global-site-json-ld";
import { PresenceHeartbeat } from "@/components/presence/presence-heartbeat";
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
const siteName = SITE_DISPLAY_NAME;
const title =
  "Vente, location de matériel médical et soins à domicile";
const description =
  "Vente et location de matériel médical au Maroc. Soins et aide à domicile au Maroc : lits, fauteuils, oxygène. Devis rapide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title,
  description,
  keywords: [
    "vente matériel médical Maroc",
    "location matériel médical Maroc",
    "matériel médical à domicile Maroc",
    "soins à domicile Maroc",
    "aide à domicile Maroc",
    "location matériel médical Agadir",
    "vente matériel médical Agadir",
    "lit médicalisé location Agadir",
    "fauteuil roulant location Agadir",
    "concentrateur oxygène location Agadir",
    "maintien à domicile Maroc",
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
        url: HOMEPAGE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: HOMEPAGE_OG_ALT,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [HOMEPAGE_OG_IMAGE],
  },
  robots: getRobotsMetadata(),
  category: "healthcare marketplace",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: LOGO.favicon, sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: LOGO.apple,
    shortcut: "/favicon.ico",
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
          <GlobalSiteJsonLd />
          <ConvexClientProvider>
            <PresenceHeartbeat />
            {children}
            <BottomNavRoot />
          </ConvexClientProvider>
          <Analytics />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
