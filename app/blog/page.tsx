import type { Metadata } from "next";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import Breadcrumb from "@/components/breadcrumb";
import { BlogPostCard } from "@/components/blog-post-card";
import { BlogSidebar } from "@/components/blog-sidebar";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import SiteFooter from "@/components/site-footer";
import { api } from "@/convex/_generated/api";
import { blogPosts } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import {
  convexToDisplay,
  mergeBlogLists,
  postHref,
} from "@/lib/blog-display";
import { HERO_IMAGE, SITE_URL_DEFAULT } from "@/lib/brand";
import {
  breadcrumbSchema,
  buildGraph,
  itemListSchema,
  webPageSchema,
} from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog matériel médical & aide à domicile | SOS Santé",
  description:
    "Guides sur la location de matériel médical à Agadir et au Maroc : lits médicalisés, fauteuils roulants, oxygène, matelas anti-escarres.",
  keywords: [
    "blog matériel médical",
    "guide lit médicalisé",
    "location matériel médical Agadir",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog matériel médical & aide à domicile | SOS Santé",
    description:
      "Guides pour choisir et louer du matériel médical à domicile.",
    url: "/blog",
    type: "website",
    locale: "fr_MA",
    siteName: "SOS Santé",
    images: [{ url: `${siteUrl}${HERO_IMAGE}` }],
  },
};

function MaterialIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default async function BlogPage() {
  let imported: ReturnType<typeof convexToDisplay>[] = [];
  try {
    const rows = await fetchQuery(api.blogArticles.listPublished, {});
    imported = rows.map(convexToDisplay);
  } catch {
    imported = [];
  }

  const posts = mergeBlogLists(blogPosts, imported);

  const blogSchema = buildGraph(
    webPageSchema(
      "/blog",
      "Blog matériel médical & aide à domicile | SOS Santé",
      "Guides sur la location de matériel médical à Agadir et au Maroc : lits médicalisés, fauteuils roulants, oxygène, matelas anti-escarres."
    ),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: "Blog", item: "/blog" },
    ]),
    itemListSchema(
      "Articles du blog",
      "/blog",
      posts.map((post) => ({ name: post.title, url: postHref(post) }))
    )
  );

  return (
    <>
      <JsonLd data={blogSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Blog" },
              ]}
            />
          </div>
        </div>

        <section className="relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-primary/5 blur-[100px]" />
            <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-secondary/5 blur-[100px]" />
          </div>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
              <MaterialIcon name="article" className="text-base" />
              Guides & conseils
            </div>
            <h1 className="font-heading mb-5 text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl md:text-5xl lg:text-6xl">
              Blog matériel médical et aide à domicile
            </h1>
            <p className="font-body mx-auto max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
              Retrouvez nos guides pratiques pour choisir, utiliser et louer du
              matériel médical à Agadir et au Maroc.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {BLOG_CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/blog/${category.slug}`}
                  className="rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-on-primary"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:pb-14">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>
            <BlogSidebar />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
