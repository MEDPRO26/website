import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sossante.ma"
).replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
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
