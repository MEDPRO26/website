import type { MetadataRoute } from "next";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import { allowIndexing, PRIVATE_CRM_PATHS } from "@/lib/indexing";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
        {
          userAgent: "Googlebot-Image",
          disallow: "/",
        },
        {
          userAgent: "Googlebot",
          disallow: "/",
        },
        {
          userAgent: "Bingbot",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_CRM_PATHS],
      },
      {
        userAgent: [
          "Googlebot",
          "Bingbot",
          "PerplexityBot",
          "ChatGPT-User",
          "GPTBot",
          "ClaudeBot",
          "anthropic-ai",
        ],
        allow: "/",
        disallow: [...PRIVATE_CRM_PATHS],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
