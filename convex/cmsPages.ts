import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdminStaff } from "./lib/authz";
import { cmsPageStatusValidator, cmsPageTypeValidator } from "./validators";

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const TYPE_LABEL: Record<string, string> = {
  page: "Page",
  service: "Service",
  materiel: "Matériel",
  ville: "Ville",
  blog: "Blog",
};

function normalizeSlug(slug: string) {
  const trimmed = slug.trim();
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export const list = query({
  args: {
    status: v.optional(cmsPageStatusValidator),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    let rows = await ctx.db.query("cmsPages").collect();
    if (args.status) {
      rows = rows.filter((row) => row.status === args.status);
    }

    return rows
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .map((row) => ({
        ...row,
        typeLabel: TYPE_LABEL[row.pageType] ?? row.pageType,
        statusLabel: row.status === "published" ? "Publié" : "Brouillon",
        updatedLabel: formatDate(row.updatedAt),
      }));
  },
});

export const get = query({
  args: { id: v.id("cmsPages") },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    return await ctx.db.get(args.id);
  },
});

/** Public — published page by URL slug (no auth). */
export const getPublishedBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const slug = normalizeSlug(args.slug);
    const page = await ctx.db
      .query("cmsPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!page || page.status !== "published") {
      return null;
    }

    return page;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    pageType: cmsPageTypeValidator,
    status: v.optional(cmsPageStatusValidator),
    indexable: v.optional(v.boolean()),
    h1: v.optional(v.string()),
    content: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const now = Date.now();
    const slug = normalizeSlug(args.slug);

    const duplicate = await ctx.db
      .query("cmsPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (duplicate) {
      throw new Error("Ce slug existe déjà.");
    }

    return await ctx.db.insert("cmsPages", {
      title: args.title.trim(),
      slug,
      pageType: args.pageType,
      status: args.status ?? "draft",
      indexable: args.indexable ?? false,
      h1: args.h1?.trim() || args.title.trim(),
      content: args.content?.trim() || undefined,
      metaTitle: args.metaTitle?.trim() || undefined,
      metaDescription: args.metaDescription?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("cmsPages"),
    title: v.string(),
    slug: v.string(),
    pageType: cmsPageTypeValidator,
    status: cmsPageStatusValidator,
    indexable: v.boolean(),
    h1: v.optional(v.string()),
    content: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdminStaff(ctx);
    const slug = normalizeSlug(args.slug);

    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      slug,
      pageType: args.pageType,
      status: args.status,
      indexable: args.indexable,
      h1: args.h1?.trim() || args.title.trim(),
      content: args.content?.trim() || undefined,
      metaTitle: args.metaTitle?.trim() || undefined,
      metaDescription: args.metaDescription?.trim() || undefined,
      updatedAt: Date.now(),
    });
  },
});

export const seedDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdminStaff(ctx);
    const existing = await ctx.db.query("cmsPages").first();
    if (existing) {
      return { seeded: false };
    }

    const now = Date.now();
    const pages = [
      {
        title: "Accueil",
        slug: "/",
        pageType: "page" as const,
        status: "published" as const,
        indexable: true,
        content:
          "SOS Santé coordonne la location de matériel médical et les services d'aide à domicile à Agadir.",
      },
      {
        title: "Location matériel médical",
        slug: "/services/location-materiel",
        pageType: "service" as const,
        status: "published" as const,
        indexable: true,
        content:
          "Location de lits médicalisés, fauteuils roulants, concentrateurs d'oxygène et plus à Agadir.",
      },
      {
        title: "Garde-malade à Agadir",
        slug: "/services/garde-malade",
        pageType: "service" as const,
        status: "published" as const,
        indexable: true,
        content:
          "Garde-malade et accompagnement à domicile à Agadir et environs.",
      },
      {
        title: "FAQ",
        slug: "/faq",
        pageType: "page" as const,
        status: "published" as const,
        indexable: true,
        content:
          "Questions fréquentes sur la location de matériel médical et nos services à Agadir.",
      },
    ];

    for (const page of pages) {
      await ctx.db.insert("cmsPages", {
        ...page,
        h1: page.title,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { seeded: true, count: pages.length };
  },
});
