import { NextResponse } from "next/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {
  categoryLabel,
  resolveCategorySlug,
} from "@/lib/blog-categories";

export const runtime = "nodejs";

function jsonError(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

function resolveSecret(request: Request) {
  const auth = request.headers.get("authorization")?.trim() ?? "";
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const url = new URL(request.url);
  return (
    url.searchParams.get("secret")?.trim() ||
    request.headers.get("x-articles-import-secret")?.trim() ||
    ""
  );
}

function toIso(ms: number | undefined) {
  if (ms == null || !Number.isFinite(ms)) return undefined;
  return new Date(ms).toISOString();
}

/** SEO Nexus Refresh: list published + draft posts. */
export async function GET(request: Request) {
  const secret = resolveSecret(request);
  const expected = process.env.ARTICLES_IMPORT_SECRET?.trim();
  if (!expected || secret !== expected) {
    return jsonError(401, "Unauthorized");
  }

  const url = new URL(request.url);
  const limitRaw = Number(url.searchParams.get("limit") ?? "100");
  const offsetRaw = Number(url.searchParams.get("offset") ?? "0");
  const limit = Number.isFinite(limitRaw) ? limitRaw : 100;
  const offset = Number.isFinite(offsetRaw) ? offsetRaw : 0;

  try {
    const result = await fetchQuery(api.blogArticles.listForNexus, {
      secret,
      limit,
      offset,
    });

    if (!result.ok) {
      return jsonError(401, "Unauthorized");
    }

    const posts = result.posts.map((article) => {
      const categorySlug = resolveCategorySlug(article.categories[0]);
      const keywords = (article.metaKeywords ?? "")
        .split(/[,;]/)
        .map((part) => part.trim())
        .filter(Boolean)
        .join("; ");

      return {
        id: article._id,
        slug: article.slug,
        title: article.title,
        status: article.status,
        content: article.html,
        markdown: article.markdown,
        excerpt: article.excerpt,
        metaTitle: article.metaTitle ?? article.title,
        metaDescription: article.metaDescription ?? article.excerpt,
        keywords,
        category: {
          name: categoryLabel(categorySlug),
          slug: categorySlug,
        },
        featuredImageUrl: article.featuredImageUrl,
        featuredImageAlt: article.featuredImageAlt,
        featuredImageR2Key: article.featuredImageR2Key,
        language: article.language,
        faqs: article.faqs,
        createdAt: toIso(article.createdAt),
        updatedAt: toIso(article.updatedAt),
        publishedAt: toIso(article.publishedAt),
      };
    });

    return NextResponse.json({
      posts,
      count: result.count,
      limit: result.limit,
      offset: result.offset,
      total: result.total,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list articles";
    return jsonError(400, message);
  }
}
