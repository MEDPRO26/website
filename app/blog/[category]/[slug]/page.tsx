import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import Breadcrumb from "@/components/breadcrumb";
import { BlogArticleBody, BlogFeaturedImage } from "@/components/blog-article-body";
import { BlogSidebar } from "@/components/blog-sidebar";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import SiteFooter from "@/components/site-footer";
import { api } from "@/convex/_generated/api";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import {
  getBlogCategory,
  isBlogCategorySlug,
} from "@/lib/blog-categories";
import {
  convexToDisplay,
  postHref,
  resolveImageSrc,
  staticToDisplay,
  type DisplayBlogPost,
} from "@/lib/blog-display";
import { CONTACT_EMAIL, products, whatsAppHref } from "@/lib/products";
import { SITE_URL_DEFAULT } from "@/lib/brand";
import {
  blogPostingSchema,
  breadcrumbSchema,
  buildGraph,
  faqSchema,
} from "@/lib/schema";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? SITE_URL_DEFAULT
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return blogPosts.map((post) => {
    const display = staticToDisplay(post);
    return { category: display.categorySlug, slug: post.slug };
  });
}

async function loadDisplayPost(slug: string): Promise<DisplayBlogPost | null> {
  try {
    const imported = await fetchQuery(api.blogArticles.getPublishedBySlug, {
      slug,
    });
    if (imported) return convexToDisplay(imported);
  } catch {
    // Convex unavailable at build time — fall back to static posts.
  }

  const staticPost = getBlogPostBySlug(slug);
  return staticPost ? staticToDisplay(staticPost) : null;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await loadDisplayPost(slug);
  if (!post) return {};

  const path = postHref(post);
  if (category !== post.categorySlug) {
    return {
      alternates: { canonical: path },
    };
  }

  const imageUrl = resolveImageSrc(post.image);

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords ?? [
      post.category,
      "matériel médical Agadir",
      "location matériel médical",
    ],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: path,
      type: "article",
      locale: "fr_MA",
      siteName: "SOS Santé",
      images: [{ url: imageUrl, alt: post.alt }],
      authors: [post.author],
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
    },
  };
}

function BlogPostJsonLd({ post }: { post: DisplayBlogPost }) {
  const path = postHref(post);
  const category = getBlogCategory(post.categorySlug);
  const nodes: Record<string, unknown>[] = [
    blogPostingSchema({
      slug: post.slug,
      categorySlug: post.categorySlug,
      categoryName: category?.name ?? post.category,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      alt: post.alt,
      author: post.author,
      publishedAt: post.publishedAt,
      modifiedAt: post.modifiedAt,
      keywords: post.keywords,
    }),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: "Blog", item: "/blog" },
      {
        name: category?.name ?? post.category,
        item: `/blog/${post.categorySlug}`,
      },
      { name: post.title, item: path },
    ]),
  ];
  if (post.faqs.length > 0) {
    nodes.push(faqSchema(post.faqs, path));
  }
  return <JsonLd data={buildGraph(...nodes)} />;
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { category, slug } = await params;

  if (!isBlogCategorySlug(category)) {
    notFound();
  }

  const post = await loadDisplayPost(slug);
  if (!post) notFound();

  if (category !== post.categorySlug) {
    redirect(postHref(post));
  }

  const relatedProducts = products.filter((p) =>
    post.relatedProducts?.includes(p.slug)
  );
  const categoryMeta = getBlogCategory(post.categorySlug);

  return (
    <>
      <BlogPostJsonLd post={post} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Blog", href: "/blog" },
                {
                  label: categoryMeta?.name ?? post.category,
                  href: `/blog/${post.categorySlug}`,
                },
                { label: post.title },
              ]}
            />
          </div>
        </div>

        <section className="px-4 pb-8 sm:px-6 sm:pb-10">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <div className="mb-8">
                <BlogFeaturedImage src={post.image} alt={post.alt} priority />
              </div>
              <article className="mx-auto max-w-3xl lg:mx-0">
                <BlogArticleBody post={post} />
              </article>

              {relatedProducts.length > 0 ? (
                <section className="mt-12 border-t border-outline-variant/30 pt-10">
                  <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl">
                    Matériel mentionné dans cet article
                  </h2>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {relatedProducts.map((product) => (
                      <article
                        key={product.slug}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                      >
                        <Link
                          href={`/produits/${product.slug}`}
                          className="relative aspect-[4/3] overflow-hidden"
                        >
                          <Image
                            src={product.image}
                            alt={product.alt}
                            fill
                            sizes="(min-width: 640px) 40vw, 100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span
                            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${product.categoryStyle}`}
                          >
                            {product.category}
                          </span>
                        </Link>
                        <div className="flex flex-1 flex-col p-4">
                          <Link href={`/produits/${product.slug}`}>
                            <h3 className="font-heading mb-2 text-base font-semibold text-primary transition-colors hover:text-primary-container sm:text-lg">
                              {product.name}
                            </h3>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="mt-12 rounded-[32px] bg-primary px-6 py-10 text-center text-on-primary sm:px-10">
                <h2 className="font-heading mb-3 text-2xl font-bold sm:text-3xl">
                  Besoin d&apos;un devis ?
                </h2>
                <p className="font-body mx-auto mb-6 max-w-lg text-white/90">
                  Contactez SOS Santé par WhatsApp ou email pour une réponse
                  rapide.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <a
                    href={whatsAppHref(
                      `Bonjour SOS Santé, j'ai lu l'article "${post.title}" et je souhaite un devis.`,
                      "general"
                    )}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-6 py-3 text-sm font-semibold text-white"
                  >
                    Email
                  </a>
                </div>
              </section>
            </div>
            <BlogSidebar
              categorySlug={post.categorySlug}
              articleTitle={post.title}
            />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
