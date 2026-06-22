import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import Navbar from "@/components/navbar";
import { blogPosts, getBlogPostBySlug } from "@/lib/blog";
import { products } from "@/lib/products";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/products";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medidomicile.ma"
).replace(/\/$/, "");

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [
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
      siteName: "MediDomicile",
      images: [{ url: `${siteUrl}${post.image}`, alt: post.alt }],
      authors: [post.author],
      publishedTime: post.publishedAt,
      modifiedTime: post.modifiedAt,
    },
  };
}

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

function BlogJsonLd({ post }: { post: (typeof blogPosts)[number] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: `${siteUrl}${post.image}`,
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "MediDomicile",
      logo: `${siteUrl}/og-image.png`,
    },
    datePublished: post.publishedAt,
    dateModified: post.modifiedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedProducts = products.filter((p) =>
    post.relatedProducts?.includes(p.slug)
  );

  return (
    <>
      <BlogJsonLd post={post} />
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
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

        {/* Hero image */}
        <section className="px-4 pb-8 sm:px-6 sm:pb-12">
          <div className="mx-auto max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={post.image}
                alt={post.alt}
                fill
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Article content */}
        <article className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-3xl">
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
                <span className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MaterialIcon name="schedule" className="text-base" />
                  {post.readTime}
                </span>
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <h1 className="font-heading mb-4 text-2xl font-bold leading-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="font-body text-lg leading-relaxed text-on-surface-variant sm:text-xl">
                {post.excerpt}
              </p>
            </header>

            <div className="prose prose-lg max-w-none">
              {post.sections.map((section, index) => {
                switch (section.type) {
                  case "paragraph":
                    return (
                      <p
                        key={index}
                        className="font-body mb-5 text-base leading-relaxed text-on-surface-variant sm:text-lg"
                      >
                        {section.content}
                      </p>
                    );
                  case "heading":
                    return (
                      <h2
                        key={index}
                        className="font-heading mb-4 mt-8 text-xl font-semibold text-primary sm:text-2xl"
                      >
                        {section.content}
                      </h2>
                    );
                  case "list":
                    return (
                      <ul
                        key={index}
                        className="mb-6 ml-5 list-disc space-y-2 font-body text-base text-on-surface-variant sm:text-lg"
                      >
                        {section.items?.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    );
                  case "tip":
                    return (
                      <div
                        key={index}
                        className="mb-6 rounded-2xl border-l-4 border-primary bg-primary/5 p-5"
                      >
                        <p className="font-heading mb-1 font-semibold text-primary">
                          {section.title}
                        </p>
                        <p className="font-body text-base text-on-surface-variant sm:text-lg">
                          {section.content}
                        </p>
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>

            {/* FAQ */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="font-heading mb-6 text-2xl font-semibold text-primary">
                  Questions fréquentes
                </h2>
                <div className="space-y-3">
                  {post.faqs.map((faq, index) => (
                    <details
                      key={index}
                      className="group overflow-hidden rounded-2xl border border-surface-container bg-white"
                      open={index === 0}
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-heading text-base font-semibold text-primary sm:p-5">
                        {faq.question}
                        <MaterialIcon
                          name="expand_more"
                          className="shrink-0 rounded-full bg-primary-container/15 p-1 text-primary transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <p className="border-t border-surface-container p-4 pt-3 font-body text-sm leading-relaxed text-on-surface-variant sm:p-5 sm:pt-4 sm:text-base">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Related products */}
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
                      <p className="font-body mb-4 flex-1 text-sm leading-relaxed text-on-surface-variant">
                        {product.description}
                      </p>
                      <Link
                        href={`/produits/${product.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2"
                      >
                        Voir le produit
                        <MaterialIcon
                          name="arrow_forward"
                          className="text-base"
                        />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-5xl rounded-[32px] bg-primary px-6 py-12 text-center text-on-primary shadow-2xl shadow-primary/25 sm:px-10 sm:py-16">
            <h2 className="font-heading mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">
              Besoin de ce matériel à Agadir ?
            </h2>
            <p className="font-body mx-auto mb-8 max-w-xl text-base text-white/90 sm:text-lg">
              Demandez votre devis gratuit et recevez une réponse sous 15
              minutes.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Bonjour%20MediDomicile%2C%20je%20souhaite%20louer%20du%20matériel%20médical.`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-surface-container-low"
              >
                <MaterialIcon name="chat" />
                WhatsApp
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Demande%20de%20devis%20matériel%20médical`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
              >
                <MaterialIcon name="mail" />
                Email
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
