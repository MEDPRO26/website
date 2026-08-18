import { isCrmHostname } from "@/lib/hosts";
import {
  getSiteUrl,
  getSitemapLastModified,
  SITEMAP_SECTIONS,
} from "@/lib/sitemap-builders";
import {
  buildSitemapIndexXml,
  SITEMAP_XML_HEADERS,
} from "@/lib/sitemap-xml";

export function GET(request: Request) {
  if (isCrmHostname(new URL(request.url).host)) {
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`,
      { headers: SITEMAP_XML_HEADERS }
    );
  }

  const xml = buildSitemapIndexXml(
    SITEMAP_SECTIONS,
    getSiteUrl(),
    getSitemapLastModified()
  );

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
