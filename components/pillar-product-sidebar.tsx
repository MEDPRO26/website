import Image from "next/image";
import Link from "next/link";
import type { PillarProductSidebarConfig } from "@/lib/pillar-sidebar-products";
import type { PillarCityProductLinks } from "@/lib/pillar-city-product-links";

function CityButtons({ links }: { links: PillarCityProductLinks }) {
  return (
    <div className="mt-2">
      <p className="font-heading mb-1.5 text-[11px] font-semibold leading-snug text-on-surface">
        {links.prompt}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {links.cities.map((city) => (
          <li key={city.href}>
            <Link
              href={city.href}
              className="font-heading inline-flex items-center rounded-md bg-primary px-2 py-1 text-[10px] font-semibold text-white transition-colors hover:bg-primary/90 sm:text-[11px]"
            >
              {city.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PillarProductSidebar({
  sidebar,
}: {
  sidebar: PillarProductSidebarConfig;
}) {
  if (sidebar.items.length === 0) return null;

  return (
    <aside className="space-y-4">
      <div className="rounded-2xl border border-outline-variant/50 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-heading text-lg font-semibold text-primary">
          {sidebar.title}
        </h2>
        {sidebar.description ? (
          <p className="font-body mt-1.5 text-sm leading-relaxed text-on-surface-variant">
            {sidebar.description}
          </p>
        ) : null}

        <ul className="mt-4 space-y-3">
          {sidebar.items.map((product) => (
            <li
              key={`${product.badge}-${product.name}`}
              className="rounded-xl border border-outline-variant/40 p-2"
            >
              <div className="flex gap-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </span>
                <span className="min-w-0 flex-1 py-0.5">
                  <span className="mb-1 inline-flex rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {product.badge}
                  </span>
                  <span className="font-heading block text-sm font-semibold leading-snug text-on-surface">
                    {product.name}
                  </span>
                </span>
              </div>
              <CityButtons links={product.cityLinks} />
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-3">
          <p className="font-heading text-sm font-semibold text-primary">
            {sidebar.catalogLabel}
          </p>
          <CityButtons links={sidebar.catalogCityLinks} />
        </div>
      </div>
    </aside>
  );
}
