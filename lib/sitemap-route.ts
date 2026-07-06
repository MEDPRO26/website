import {
  getSiteUrl,
  getSitemapEntries,
  getSitemapLastModified,
  type SitemapId,
} from "@/lib/sitemap-builders";
import { buildUrlsetXml, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export function createSitemapSectionHandler(id: SitemapId) {
  return function GET() {
    const xml = buildUrlsetXml(
      getSitemapEntries(id),
      getSiteUrl(),
      getSitemapLastModified()
    );

    return new Response(xml, { headers: SITEMAP_XML_HEADERS });
  };
}
