import type { Metadata } from "next";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import { getPrivateRobotsMetadata } from "@/lib/indexing";

export function crmPageMetadata(title: string): Metadata {
  return {
    title,
    applicationName: CRM_BRAND_NAME,
    robots: getPrivateRobotsMetadata(),
    icons: {
      icon: [
        { url: CRM_LOGO, type: "image/png", sizes: "32x32" },
        { url: CRM_LOGO, type: "image/png", sizes: "192x192" },
      ],
      apple: CRM_LOGO,
      shortcut: CRM_LOGO,
    },
  };
}
