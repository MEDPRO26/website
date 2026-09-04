import Image from "next/image";
import Link from "next/link";
import {
  isRemoteImage,
  postHref,
  type DisplayBlogPost,
} from "@/lib/blog-display";

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

export function BlogPostCard({ post }: { post: DisplayBlogPost }) {
  const href = postHref(post);
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-container-high bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      <Link href={href} className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          alt={post.alt}
          fill
          unoptimized={isRemoteImage(post.image)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
          <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
            {post.category}
          </span>
          <span>{post.readTime}</span>
        </div>
        <Link href={href}>
          <h2 className="font-heading mb-2 text-lg font-semibold text-primary transition-colors group-hover:text-primary-container sm:text-xl">
            {post.title}
          </h2>
        </Link>
        <p className="font-body mb-4 flex-1 text-sm leading-relaxed text-on-surface-variant">
          {post.excerpt}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          Lire l&apos;article
          <MaterialIcon name="arrow_forward" className="text-base" />
        </Link>
      </div>
    </article>
  );
}
