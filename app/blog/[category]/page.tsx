import { notFound, redirect } from "next/navigation";
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
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import {
  BLOG_CATEGORIES,
  getBlogCategory,
  isBlogCategorySlug,
} from "@/lib/blog-categories";
import {
  convexToDisplay,
  filterPostsByCategory,
  mergeBlogLists,
  postHref,
  staticToDisplay,
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

type PageProps = {
  params: Promise<{ category: string }>;
};

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({ category: category.slug }));
}

async function loadAllPosts() {
  let imported: ReturnType<typeof convexToDisplay>[] = [];
  try {
    const rows = await fetchQuery(api.blogArticles.listPublished, {});
    imported = rows.map(convexToDisplay);
  } catch {
    imported = [];
  }
  return mergeBlogLists(blogPosts, imported);
}

async function resolveLegacyArticleRedirect(segment: string) {
  try {
    const imported = await fetchQuery(api.blogArticles.getPublishedBySlug, {
      slug: segment,
    });
    if (imported) {
      const post = convexToDisplay(imported);
      redirect(postHref(post));
    }
  } catch (error) {
    // redirect() throws — rethrow Next redirects
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
  }

  const staticPost = getBlogPostBySlug(segment);
  if (staticPost) {
    redirect(postHref(staticToDisplay(staticPost)));
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: segment } = await params;
  if (!isBlogCategorySlug(segment)) {
    return {};
  }
  const category = getBlogCategory(segment)!;
  return {
    title: `${category.name} | Blog SOS Santé`,
    description: category.description,
    alternates: {
      canonical: `/blog/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} | Blog SOS Santé`,
      description: category.description,
      url: `/blog/${category.slug}`,
      type: "website",
      locale: "fr_MA",
      siteName: "SOS Santé",
      images: [{ url: `${siteUrl}${HERO_IMAGE}` }],
    },
  };
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category: segment } = await params;

  if (!isBlogCategorySlug(segment)) {
    await resolveLegacyArticleRedirect(segment);
    notFound();
  }

  const category = getBlogCategory(segment)!;
  const allPosts = await loadAllPosts();
  const posts = filterPostsByCategory(allPosts, category.slug);

  const schema = buildGraph(
    webPageSchema(
      `/blog/${category.slug}`,
      `${category.name} | Blog SOS Santé`,
      category.description
    ),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: "Blog", item: "/blog" },
      { name: category.name, item: `/blog/${category.slug}` },
    ]),
    itemListSchema(
      `Articles ${category.name}`,
      `/blog/${category.slug}`,
      posts.map((post) => ({ name: post.title, url: postHref(post) }))
    )
  );

  return (
    <>
      <JsonLd data={schema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: category.name },
              ]}
            />
          </div>
        </div>

        <section className="px-4 pb-8 pt-4 sm:px-6 sm:pb-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="font-heading mb-3 text-3xl font-bold text-primary sm:text-4xl">
              {category.name}
            </h1>
            <p className="font-body max-w-2xl text-base text-on-surface-variant sm:text-lg">
              {category.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="rounded-full border border-outline-variant/40 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:border-primary/30 hover:text-primary"
              >
                Tous
              </Link>
              {BLOG_CATEGORIES.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    item.slug === category.slug
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant/40 text-on-surface-variant hover:border-primary/30 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              {posts.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-outline-variant/50 bg-white p-8 text-center text-sm text-on-surface-variant">
                  Aucun article publié dans cette catégorie pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {posts.map((post) => (
                    <BlogPostCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </div>
            <BlogSidebar categorySlug={category.slug} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
