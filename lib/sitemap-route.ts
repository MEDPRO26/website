import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { isCrmHostname } from "@/lib/hosts";
import {
  getBlogSitemapEntries,
  getSiteUrl,
  getSitemapEntries,
  getSitemapLastModified,
  type SitemapId,
} from "@/lib/sitemap-builders";
import { buildUrlsetXml, SITEMAP_XML_HEADERS } from "@/lib/sitemap-xml";

export function createSitemapSectionHandler(id: SitemapId) {
  return async function GET(request: Request) {
    if (isCrmHostname(new URL(request.url).host)) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
        { headers: SITEMAP_XML_HEADERS }
      );
    }

    let entries = getSitemapEntries(id);

    if (id === "blog") {
      let convexPosts: { slug: string; categorySlug: string }[] = [];
      try {
        convexPosts = await fetchQuery(api.blogArticles.listPublishedSlugs, {});
      } catch {
        // Convex unavailable — keep static blog URLs only.
      }
      entries = getBlogSitemapEntries(convexPosts);
    }

    const xml = buildUrlsetXml(
      entries,
      getSiteUrl(),
      getSitemapLastModified()
    );

    return new Response(xml, { headers: SITEMAP_XML_HEADERS });
  };
}
