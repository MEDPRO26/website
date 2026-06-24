import type { MetadataRoute } from "next";
import { allowIndexing } from "@/lib/indexing";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sossante.ma"
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
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
