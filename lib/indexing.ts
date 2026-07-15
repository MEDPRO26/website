import type { Metadata } from "next";

/** Set NEXT_PUBLIC_ALLOW_INDEXING=true in Vercel when the site is ready for SEO. */
export const allowIndexing =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const X_ROBOTS_NOINDEX =
  "noindex, nofollow, noarchive, nosnippet, noimageindex";

const robotsIndex: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

const robotsNoIndex: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  noimageindex: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
    "max-image-preview": "none",
  },
};

export function getRobotsMetadata(): Metadata["robots"] {
  return allowIndexing ? robotsIndex : robotsNoIndex;
}

/** Admin CRM, supplier portal, and login — never index regardless of site SEO setting. */
export function getPrivateRobotsMetadata(): Metadata["robots"] {
  return robotsNoIndex;
}

/** Paths blocked in robots.txt even when the public site is indexed. */
export const PRIVATE_CRM_PATHS = [
  "/admin",
  "/admin-me",
  "/supplier",
  "/fournisseurs",
  "/__crm-hidden",
] as const;

