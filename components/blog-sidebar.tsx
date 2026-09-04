import Image from "next/image";
import Link from "next/link";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import { CONTACT_EMAIL, products, whatsAppHref } from "@/lib/products";
import { WhatsAppIcon } from "@/components/whatsapp-icon";

const CATEGORY_PRODUCT_MATCH: Record<string, string[]> = {
  respiratoire: ["Respiratoire"],
  mobilite: ["Mobilier Médical"],
  confort: ["Confort", "Mobilier Médical"],
  guide: ["Respiratoire", "Confort", "Mobilier Médical"],
  location: ["Respiratoire", "Confort", "Mobilier Médical"],
  soins: ["Respiratoire", "Confort"],
  "famille-aidants": ["Confort", "Mobilier Médical"],
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

export function BlogSidebar({
  categorySlug,
  articleTitle,
}: {
  categorySlug?: string;
  articleTitle?: string;
}) {
  const matchCats = CATEGORY_PRODUCT_MATCH[categorySlug ?? "guide"] ?? [
    "Respiratoire",
    "Confort",
  ];
  const offers = products
    .filter((product) => matchCats.includes(product.category))
    .slice(0, 3);

  const waMessage = articleTitle
    ? `Bonjour SOS Santé, j'ai lu l'article "${articleTitle}" et je souhaite un devis.`
    : "Bonjour SOS Santé, je souhaite un devis pour du matériel médical.";

  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      <div className="rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm">
        <h2 className="font-heading mb-2 text-lg font-semibold text-primary">
          Nos offres
        </h2>
        <p className="font-body mb-4 text-sm text-on-surface-variant">
          Location et livraison de matériel médical à Agadir, Casablanca et
          Rabat.
        </p>
        <ul className="space-y-3">
          {offers.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/produits/${product.slug}`}
                className="group flex gap-3 rounded-xl border border-transparent p-1.5 transition-colors hover:border-primary/15 hover:bg-primary/5"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0">
                  <span className="font-heading block text-sm font-semibold text-primary group-hover:text-primary-container">
                    {product.name}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {product.category}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/services"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
        >
          Voir tous les services
          <MaterialIcon name="arrow_forward" className="text-base" />
        </Link>
      </div>

      <div className="rounded-2xl bg-primary p-5 text-on-primary">
        <h2 className="font-heading mb-2 text-lg font-semibold">
          Besoin d&apos;aide ?
        </h2>
        <p className="font-body mb-4 text-sm text-white/90">
          Un conseiller SOS Santé vous répond en général sous 15 minutes.
        </p>
        <div className="flex flex-col gap-2">
          <a
            href={whatsAppHref(waMessage, "general")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Email
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-container-high bg-white p-5 shadow-sm">
        <h2 className="font-heading mb-3 text-lg font-semibold text-primary">
          Catégories
        </h2>
        <ul className="space-y-1.5">
          {BLOG_CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog/${category.slug}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  category.slug === categorySlug
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-primary"
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
