import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchQuery } from "convex/nextjs";
import Breadcrumb from "@/components/breadcrumb";
import { BlogArticleBody, BlogFeaturedImage } from "@/components/blog-article-body";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import SiteFooter from "@/components/site-footer";
import { api } from "@/convex/_generated/api";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import {
  convexToDisplay,
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
  params: Promise<{ slug: string }>;
};

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
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
  const { slug } = await params;
  const post = await loadDisplayPost(slug);
  if (!post) return {};

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
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `/blog/${slug}`,
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
  const nodes: Record<string, unknown>[] = [
    blogPostingSchema({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image,
      alt: post.alt,
      author: post.author,
      publishedAt: post.publishedAt,
      modifiedAt: post.modifiedAt,
    }),
    breadcrumbSchema([
      { name: "Accueil", item: "/" },
      { name: "Blog", item: "/blog" },
      { name: post.title, item: `/blog/${post.slug}` },
    ]),
  ];
  if (post.faqs.length > 0) {
    nodes.push(faqSchema(post.faqs, `/blog/${post.slug}`));
  }
  return <JsonLd data={buildGraph(...nodes)} />;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadDisplayPost(slug);

  if (!post) notFound();

  const relatedProducts = products.filter((p) =>
    post.relatedProducts?.includes(p.slug)
  );

  return (
    <>
      <BlogPostJsonLd post={post} />
      <Navbar />
      <main className="flex-1 pb-20 pt-[calc(var(--site-header-offset,4rem)+0.5rem)] md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: post.title },
              ]}
            />
          </div>
        </div>

        <section className="px-4 pb-8 sm:px-6 sm:pb-12">
          <div className="mx-auto max-w-4xl">
            <BlogFeaturedImage src={post.image} alt={post.alt} priority />
          </div>
        </section>

        <article className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <BlogArticleBody post={post} />
          </div>
        </article>

        {relatedProducts.length > 0 && (
          <section className="border-t border-outline-variant/30 px-4 py-10 sm:px-6 sm:py-14">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl md:text-3xl">
                Matériel mentionné dans cet article
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
            </div>
          </section>
        )}

        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl rounded-[32px] bg-primary px-6 py-10 text-center text-on-primary sm:px-10">
            <h2 className="font-heading mb-3 text-2xl font-bold sm:text-3xl">
              Besoin d&apos;un devis ?
            </h2>
            <p className="font-body mx-auto mb-6 max-w-lg text-white/90">
              Contactez SOS Santé par WhatsApp ou email pour une réponse rapide.
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
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
