import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import { isCrmHostname } from "@/lib/hosts";
import {
  allowIndexing,
  CRM_ROBOTS_USER_AGENTS,
  PRIVATE_CRM_PATHS,
} from "@/lib/indexing";

export const dynamic = "force-dynamic";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

function requestHost(headerList: Headers) {
  return headerList.get("x-forwarded-host") ?? headerList.get("host");
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = requestHost(await headers());
  if (isCrmHostname(host)) {
    return {
      rules: CRM_ROBOTS_USER_AGENTS.map((userAgent) => ({
        userAgent,
        disallow: "/",
      })),
    };
  }

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
          "Googlebot-Image",
          "Bingbot",
          "DuckDuckBot",
          "Google-Extended",
          "PerplexityBot",
          "ChatGPT-User",
          "GPTBot",
          "OAI-SearchBot",
          "ClaudeBot",
          "anthropic-ai",
          "Claude-Web",
          "CCBot",
          "Bytespider",
          "meta-externalagent",
          "FacebookBot",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: [...PRIVATE_CRM_PATHS],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: new URL(siteUrl).host,
  };
}
