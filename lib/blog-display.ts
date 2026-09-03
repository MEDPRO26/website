import { blogPosts, type BlogPost } from "@/lib/blog";
import { categoryLabel } from "@/lib/blog-categories";
import { PUBLIC_SITE_ORIGIN } from "@/lib/hosts";

export type DisplayBlogPost = {
  source: "static" | "convex";
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  categories: string[];
  author: string;
  publishedAt: string;
  modifiedAt: string;
  readTime: string;
  image: string;
  alt: string;
  html?: string;
  sections?: BlogPost["sections"];
  faqs: { question: string; answer: string }[];
  relatedProducts?: string[];
  keywords?: string[];
};

function toDateString(value: number | string | undefined) {
  if (typeof value === "number") {
    return new Date(value).toISOString().slice(0, 10);
  }
  if (typeof value === "string" && value) return value.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

export function staticToDisplay(post: BlogPost): DisplayBlogPost {
  return {
    source: "static",
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    metaTitle: post.metaTitle,
    metaDescription: post.metaDescription,
    category: post.category,
    categories: [post.category.toLowerCase()],
    author: post.author,
    publishedAt: post.publishedAt,
    modifiedAt: post.modifiedAt,
    readTime: post.readTime,
    image: post.image,
    alt: post.alt,
    sections: post.sections,
    faqs: post.faqs ?? [],
    relatedProducts: post.relatedProducts,
  };
}

export function convexToDisplay(article: {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  categories: string[];
  author: string;
  publishedAt?: number;
  updatedAt: number;
  createdAt: number;
  readTime: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  html: string;
  faqs: { question: string; answer: string }[];
}): DisplayBlogPost {
  const categorySlug = article.categories[0] ?? "conseil";
  return {
    source: "convex",
    id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    metaTitle: article.metaTitle || article.title,
    metaDescription: article.metaDescription || article.excerpt,
    category: categoryLabel(categorySlug),
    categories: article.categories,
    author: article.author,
    publishedAt: toDateString(article.publishedAt ?? article.createdAt),
    modifiedAt: toDateString(article.updatedAt),
    readTime: article.readTime,
    image: article.featuredImageUrl || "/sos-sante-hero.webp",
    alt: article.featuredImageAlt || article.title,
    html: article.html,
    faqs: article.faqs,
    keywords: article.metaKeywords
      ? article.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
  };
}

export function resolveImageSrc(src: string) {
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? PUBLIC_SITE_ORIGIN
  ).replace(/\/$/, "");
  return `${base}${src.startsWith("/") ? src : `/${src}`}`;
}

export function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function mergeBlogLists(
  staticPosts: BlogPost[],
  convexPosts: DisplayBlogPost[]
): DisplayBlogPost[] {
  const bySlug = new Map<string, DisplayBlogPost>();
  for (const post of staticPosts) {
    bySlug.set(post.slug, staticToDisplay(post));
  }
  // Imported Convex posts win on slug collision.
  for (const post of convexPosts) {
    bySlug.set(post.slug, post);
  }
  return [...bySlug.values()].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}
