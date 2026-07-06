import {
  getSiteUrl,
  getSitemapLastModified,
  SITEMAP_SECTIONS,
} from "@/lib/sitemap-builders";
import {
  buildSitemapIndexXml,
  SITEMAP_XML_HEADERS,
} from "@/lib/sitemap-xml";

export function GET() {
  const xml = buildSitemapIndexXml(
    SITEMAP_SECTIONS,
    getSiteUrl(),
    getSitemapLastModified()
  );

  return new Response(xml, { headers: SITEMAP_XML_HEADERS });
}
