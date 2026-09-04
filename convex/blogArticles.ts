import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminPermission, requireAdminStaff } from "./lib/authz";

const faqValidator = v.object({
  question: v.string(),
  answer: v.string(),
});

function assertImportSecret(secret: string) {
  const expected = process.env.ARTICLES_IMPORT_SECRET?.trim();
  if (!expected || secret !== expected) {
    return false;
  }
  return true;
}

export const importFromNexus = mutation({
  args: {
    secret: v.string(),
    title: v.string(),
    slug: v.string(),
    language: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    markdown: v.string(),
    html: v.string(),
    publish: v.optional(v.boolean()),
    updateIfExists: v.optional(v.boolean()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaKeywords: v.optional(v.string()),
    featuredImageUrl: v.optional(v.string()),
    featuredImageR2Key: v.optional(v.string()),
    featuredImageAlt: v.optional(v.string()),
    categories: v.optional(v.array(v.string())),
    faqs: v.optional(v.array(faqValidator)),
    author: v.optional(v.string()),
    readTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!assertImportSecret(args.secret)) {
      return { ok: false as const, error: "unauthorized" as const };
    }

    const slug = args.slug.trim().toLowerCase();
    if (!slug || !args.title.trim() || !args.markdown.trim()) {
      return {
        ok: false as const,
        error: "title, slug and markdown are required" as const,
      };
    }

    const now = Date.now();
    const status = args.publish ? ("published" as const) : ("draft" as const);
    const existing = await ctx.db
      .query("blogArticles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (existing && args.updateIfExists === false) {
      return {
        ok: false as const,
        error: `slug already exists: ${slug}` as const,
      };
    }

    const payload = {
      title: args.title.trim(),
      slug,
      language: (args.language ?? "fr").trim() || "fr",
      excerpt: (args.excerpt ?? "").trim(),
      markdown: args.markdown,
      html: args.html,
      status,
      metaTitle: args.metaTitle?.trim() || undefined,
      metaDescription: args.metaDescription?.trim() || undefined,
      metaKeywords: args.metaKeywords?.trim() || undefined,
      featuredImageUrl: args.featuredImageUrl?.trim() || undefined,
      featuredImageR2Key: args.featuredImageR2Key?.trim() || undefined,
      featuredImageAlt: args.featuredImageAlt?.trim() || undefined,
      categories: (args.categories ?? [])
        .map((c) => c.trim().toLowerCase())
        .filter(Boolean),
      faqs: (args.faqs ?? []).filter(
        (faq) => faq.question.trim() && faq.answer.trim()
      ),
      author: (args.author ?? "SOS Santé").trim() || "SOS Santé",
      readTime: (args.readTime ?? "5 min").trim() || "5 min",
      publishedAt:
        status === "published"
          ? (existing?.publishedAt ?? now)
          : existing?.publishedAt,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, payload);
      return {
        ok: true as const,
        id: existing._id,
        slug,
        language: payload.language,
        status,
        created: false,
      };
    }

    const id = await ctx.db.insert("blogArticles", {
      ...payload,
      createdAt: now,
    });

    return {
      ok: true as const,
      id,
      slug,
      language: payload.language,
      status,
      created: true,
    };
  },
});

function isPubliclyVisible(
  article: { status: string; publishedAt?: number },
  now = Date.now()
) {
  if (article.status !== "published") return false;
  if (article.publishedAt == null) return true;
  return article.publishedAt <= now;
}

/** Public: published article by slug. */
export const getPublishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = args.slug.trim().toLowerCase();
    const article = await ctx.db
      .query("blogArticles")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!article || !isPubliclyVisible(article)) return null;
    return article;
  },
});

/** Public: published articles for blog index / sitemap. */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const rows = await ctx.db
      .query("blogArticles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    return rows
      .filter((row) => isPubliclyVisible(row, now))
      .sort(
        (a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt)
      );
  },
});

export const listPublishedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const rows = await ctx.db
      .query("blogArticles")
      .withIndex("by_status", (q) => q.eq("status", "published"))
      .collect();
    return rows
      .filter((row) => isPubliclyVisible(row, now))
      .map((row) => ({
        slug: row.slug,
        categorySlug: row.categories[0] ?? "guide",
      }));
  },
});

/** CRM: all articles. */
export const listForAdmin = query({
  args: {
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "cms.manage_blog");
    const rows = args.status
      ? await ctx.db
          .query("blogArticles")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .collect()
      : await ctx.db.query("blogArticles").collect();
    return rows.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

export const setStatus = mutation({
  args: {
    id: v.id("blogArticles"),
    status: v.union(v.literal("draft"), v.literal("published")),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "cms.manage_blog");
    const article = await ctx.db.get(args.id);
    if (!article) throw new Error("Article introuvable");
    const now = Date.now();
    let publishedAt = article.publishedAt;
    if (args.status === "published") {
      publishedAt =
        args.publishedAt != null && Number.isFinite(args.publishedAt)
          ? args.publishedAt
          : (article.publishedAt ?? now);
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: now,
      publishedAt,
    });
    return { ok: true };
  },
});

/** CRM: set or change the public publish date/time. */
export const setPublishedAt = mutation({
  args: {
    id: v.id("blogArticles"),
    publishedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "cms.manage_blog");
    const article = await ctx.db.get(args.id);
    if (!article) throw new Error("Article introuvable");
    if (!Number.isFinite(args.publishedAt)) {
      throw new Error("Date de publication invalide");
    }
    await ctx.db.patch(args.id, {
      publishedAt: args.publishedAt,
      updatedAt: Date.now(),
    });
    return { ok: true as const };
  },
});

export const remove = mutation({
  args: { id: v.id("blogArticles") },
  handler: async (ctx, args) => {
    await requireAdminPermission(ctx, "cms.manage_blog");
    await requireAdminStaff(ctx);
    const article = await ctx.db.get(args.id);
    if (!article) throw new Error("Article introuvable");
    await ctx.db.delete(args.id);
    return { ok: true };
  },
});
