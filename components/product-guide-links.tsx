import Link from "next/link";
import { getBlogPostsForProduct } from "@/lib/content-links";

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

export default function ProductGuideLinks({ productSlug }: { productSlug: string }) {
  const posts = getBlogPostsForProduct(productSlug);
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-outline-variant/30 px-0 py-10 sm:py-14">
      <h2 className="font-heading mb-6 text-xl font-semibold text-primary sm:text-2xl">
        Guides et conseils
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex items-start gap-4 rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-on-primary">
              <MaterialIcon name="menu_book" className="text-2xl" />
            </div>
            <div>
              <h3 className="font-heading mb-1 text-base font-semibold text-secondary group-hover:text-primary sm:text-lg">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
