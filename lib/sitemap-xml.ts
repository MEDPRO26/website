import type { SitemapEntry } from "@/lib/sitemap-builders";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderUrl(entry: SitemapEntry, siteUrl: string, lastModified: string) {
  const loc = `${siteUrl}${entry.path}`;
  const imageBlock = entry.image
    ? `
    <image:image>
      <image:loc>${escapeXml(`${siteUrl}${entry.image}`)}</image:loc>
    </image:image>`
    : "";

  return `
  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${entry.priority.toFixed(2)}</priority>${imageBlock}
  </url>`;
}

export function buildUrlsetXml(
  entries: SitemapEntry[],
  siteUrl: string,
  lastModified: string
) {
  const urls = entries.map((entry) => renderUrl(entry, siteUrl, lastModified)).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}
</urlset>`;
}

export function buildSitemapIndexXml(
  sections: { path: string }[],
  siteUrl: string,
  lastModified: string
) {
  const items = sections
    .map(
      (section) => `
  <sitemap>
    <loc>${escapeXml(`${siteUrl}${section.path}`)}</loc>
    <lastmod>${lastModified}</lastmod>
  </sitemap>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}
</sitemapindex>`;
}

export const SITEMAP_XML_HEADERS = {
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
} as const;
