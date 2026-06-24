import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";
import JsonLd from "@/components/json-ld";
import Navbar from "@/components/navbar";
import { blogPosts } from "@/lib/blog";
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

export const metadata: Metadata = {
  title: "Blog matériel médical & aide à domicile | SOS Santé",
  description:
    "Conseils et guides sur la location de matériel médical à Agadir et au Maroc : lits médicalisés, fauteuils roulants, oxygène, matelas anti-escarres.",
  keywords: [
    "blog matériel médical",
    "conseils aide à domicile",
    "guide lit médicalisé",
    "location matériel médical Agadir",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog matériel médical & aide à domicile | SOS Santé",
    description:
      "Guides et conseils pour choisir et louer du matériel médical à domicile.",
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

const blogSchema = buildGraph(
  webPageSchema(
    "/blog",
    "Blog matériel médical & aide à domicile | SOS Santé",
    "Conseils et guides sur la location de matériel médical à Agadir et au Maroc : lits médicalisés, fauteuils roulants, oxygène, matelas anti-escarres."
  ),
  breadcrumbSchema([
    { name: "Accueil", item: "/" },
    { name: "Blog", item: "/blog" },
  ]),
  itemListSchema(
    "Articles du blog",
    "/blog",
    blogPosts.map((post) => ({ name: post.title, url: `/blog/${post.slug}` }))
  )
);

export default function BlogPage() {
  return (
    <>
      <JsonLd data={blogSchema} />
      <Navbar />
      <main className="flex-1 pb-20 pt-16 md:pb-0 md:pt-20">
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

        {/* Hero */}
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
          </div>
        </section>

        {/* Blog grid */}
        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="relative aspect-[16/10] overflow-hidden"
                  >
                    <Image
                      src={post.image}
                      alt={post.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-on-primary">
                      {post.category}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center gap-3 text-xs text-on-surface-variant">
                      <span className="inline-flex items-center gap-1">
                        <MaterialIcon name="schedule" className="text-sm" />
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
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="font-heading mb-3 text-lg font-semibold text-primary transition-colors hover:text-primary-container sm:text-xl">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="font-body mb-5 flex-1 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2"
                    >
                      Lire l’article
                      <MaterialIcon name="arrow_forward" className="text-base" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
