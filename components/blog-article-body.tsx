import Image from "next/image";
import Link from "next/link";
import type { DisplayBlogPost } from "@/lib/blog-display";
import { isRemoteImage, postCategoryHref } from "@/lib/blog-display";
import { stripBodyH1 } from "@/lib/markdown";
import { ABOUT_PATH, ABOUT_SHORT } from "@/lib/about-content";
import { SITE_NAME } from "@/lib/brand";

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

export function BlogArticleBody({ post }: { post: DisplayBlogPost }) {
  const bodyHtml = post.html ? stripBodyH1(post.html) : undefined;

  return (
    <>
      <header className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
          <Link
            href={postCategoryHref(post)}
            className="rounded-full bg-primary/10 px-3 py-1 font-medium text-primary hover:bg-primary/15"
          >
            {post.category}
          </Link>
          <span className="inline-flex items-center gap-1">
            <MaterialIcon name="schedule" className="text-base" />
            {post.readTime}
          </span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
        <h1 className="font-heading mb-4 text-2xl font-bold leading-tight text-primary sm:text-3xl md:text-4xl lg:text-5xl">
          {post.title}
        </h1>
        {post.excerpt ? (
          <p className="blog-excerpt font-body text-lg leading-relaxed text-on-surface-variant sm:text-xl">
            {post.excerpt}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-start gap-3 rounded-2xl border border-surface-container-high bg-surface-container-low/40 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MaterialIcon name="verified" className="text-xl" />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-sm font-semibold text-primary">
              Rédigé par{" "}
              <Link href={ABOUT_PATH} className="underline-offset-2 hover:underline">
                {post.author || SITE_NAME}
              </Link>
            </p>
            <p className="mt-1 font-body text-sm leading-relaxed text-on-surface-variant">
              {ABOUT_SHORT}{" "}
              <Link
                href={ABOUT_PATH}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                En savoir plus
              </Link>
            </p>
          </div>
        </div>
      </header>

      {bodyHtml ? (
        <div
          className="blog-prose font-body text-base leading-relaxed text-on-surface-variant sm:text-lg [&_a]:text-primary [&_a]:underline [&_h2]:font-heading [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary sm:[&_h2]:text-2xl [&_h3]:font-heading [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-primary [&_img]:my-6 [&_img]:h-auto [&_img]:w-full [&_img]:rounded-2xl [&_li]:mb-1 [&_ol]:mb-6 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-5 [&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-outline-variant/40 [&_td]:px-3 [&_td]:py-2 [&_th]:border [&_th]:border-outline-variant/40 [&_th]:bg-surface-container-low [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_ul]:mb-6 [&_ul]:ml-5 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      ) : (
        <div className="prose prose-lg max-w-none">
          {post.sections?.map((section, index) => {
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
      )}

      {post.faqs.length > 0 ? (
        <div className="mt-12">
          <h2 className="font-heading mb-6 text-2xl font-semibold text-secondary">
            Questions fréquentes
          </h2>
          <div className="space-y-3">
            {post.faqs.map((faq, index) => (
              <details
                key={`${faq.question}-${index}`}
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
      ) : null}
    </>
  );
}

export function BlogFeaturedImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const remote = isRemoteImage(src);
  return (
    <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-xl">
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={remote}
        sizes="(min-width: 1024px) 66vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
