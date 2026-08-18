import { isCrmHostname } from "@/lib/hosts";
import {
  getSiteUrl,
  getSitemapEntries,
  getSitemapLastModified,
  type SitemapId,
} from "@/lib/sitemap-builders";
import { buildUrlsetXml, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export function createSitemapSectionHandler(id: SitemapId) {
  return function GET(request: Request) {
    if (isCrmHostname(new URL(request.url).host)) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
        { headers: SITEMAP_XML_HEADERS }
      );
    }

    const xml = buildUrlsetXml(
      getSitemapEntries(id),
      getSiteUrl(),
      getSitemapLastModified()
    );

    return new Response(xml, { headers: SITEMAP_XML_HEADERS });
  };
}
