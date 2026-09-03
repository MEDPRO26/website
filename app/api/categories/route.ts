import { NextResponse } from "next/server";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";

export const runtime = "nodejs";

/**
 * Public category list for SEO Nexus "Refresh from site".
 * Payload-shaped: { docs: [{ id, title, name, slug }], hasNextPage }.
 */
export async function GET() {
  const docs = BLOG_CATEGORIES.map((category) => ({
    id: category.id,
    title: category.name,
    name: category.name,
    slug: category.slug,
  }));

  return NextResponse.json({
    docs,
    hasNextPage: false,
    categories: docs,
  });
}
