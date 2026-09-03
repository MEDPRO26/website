import { NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { PUBLIC_SITE_ORIGIN } from "@/lib/hosts";
import {
  estimateReadTime,
  markdownToHtml,
  normalizeSlug,
} from "@/lib/markdown";

export const runtime = "nodejs";

type ImportBody = {
  secret?: string;
  title?: string;
  slug?: string;
  language?: string;
  excerpt?: string;
  markdown?: string;
  publish?: boolean;
  updateIfExists?: boolean;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
  featuredImageR2Key?: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  useExistingR2Image?: boolean;
  categories?: string[];
  faqs?: Array<{ question?: string; answer?: string }>;
};

function jsonError(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

export async function POST(request: Request) {
  let body: ImportBody;
  try {
    body = (await request.json()) as ImportBody;
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const secret = body.secret?.trim() ?? "";
  const expected = process.env.ARTICLES_IMPORT_SECRET?.trim();
  if (!expected || secret !== expected) {
    return jsonError(401, "Unauthorized");
  }

  const title = body.title?.trim() ?? "";
  const slugRaw = body.slug?.trim() || title;
  const slug = normalizeSlug(slugRaw);
  const markdown = body.markdown?.trim() ?? "";

  if (!title || !slug || !markdown) {
    return jsonError(400, "title, slug and markdown are required");
  }

  const html = markdownToHtml(markdown, title);
  const faqs = (body.faqs ?? [])
    .map((faq) => ({
      question: faq.question?.trim() ?? "",
      answer: faq.answer?.trim() ?? "",
    }))
    .filter((faq) => faq.question && faq.answer);

  try {
    const result = await fetchMutation(api.blogArticles.importFromNexus, {
      secret,
      title,
      slug,
      language: body.language ?? "fr",
      excerpt: body.excerpt?.trim() ?? "",
      markdown,
      html,
      publish: body.publish === true,
      updateIfExists: body.updateIfExists !== false,
      metaTitle: body.meta?.title,
      metaDescription: body.meta?.description,
      metaKeywords: body.meta?.keywords,
      featuredImageUrl: body.featuredImageUrl,
      featuredImageR2Key: body.featuredImageR2Key,
      featuredImageAlt: body.featuredImageAlt,
      categories: body.categories ?? [],
      faqs,
      readTime: estimateReadTime(markdown),
      author: "SOS Santé",
    });

    if (!result.ok) {
      if (result.error === "unauthorized") {
        return jsonError(401, "Unauthorized");
      }
      return jsonError(400, result.error);
    }

    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ?? PUBLIC_SITE_ORIGIN
    ).replace(/\/$/, "");

    return NextResponse.json({
      success: true,
      id: result.id,
      slug: result.slug,
      language: result.language,
      status: result.status,
      url: `${siteUrl}/blog/${result.slug}`,
      created: result.created,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Import failed";
    return jsonError(400, message);
  }
}
