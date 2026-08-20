import type { Metadata } from "next";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import { CRM_SITE_ORIGIN } from "@/lib/hosts";
import { getPrivateRobotsMetadata } from "@/lib/indexing";

/** Neutral company preview — never inherit SOS Santé “vente matériel” OG tags. */
const CRM_OG_TITLE = CRM_BRAND_NAME;
const CRM_OG_DESCRIPTION = "Société S2MBO";
const CRM_OG_IMAGE = `${CRM_SITE_ORIGIN.replace(/\/$/, "")}${CRM_LOGO}`;

export function crmPageMetadata(title: string): Metadata {
  return {
    title,
    description: CRM_OG_DESCRIPTION,
    applicationName: CRM_BRAND_NAME,
    keywords: [],
    authors: [{ name: CRM_BRAND_NAME }],
    creator: CRM_BRAND_NAME,
    publisher: CRM_BRAND_NAME,
    category: "business",
    robots: getPrivateRobotsMetadata(),
    icons: {
      icon: [
        { url: CRM_LOGO, type: "image/png", sizes: "32x32" },
        { url: CRM_LOGO, type: "image/png", sizes: "192x192" },
      ],
      apple: CRM_LOGO,
      shortcut: CRM_LOGO,
    },
    openGraph: {
      type: "website",
      locale: "fr_MA",
      siteName: CRM_BRAND_NAME,
      title: CRM_OG_TITLE,
      description: CRM_OG_DESCRIPTION,
      images: [
        {
          url: CRM_OG_IMAGE,
          width: 1024,
          height: 1024,
          alt: CRM_BRAND_NAME,
        },
      ],
    },
    twitter: {
      card: "summary",
      title: CRM_OG_TITLE,
      description: CRM_OG_DESCRIPTION,
      images: [CRM_OG_IMAGE],
    },
  };
}
