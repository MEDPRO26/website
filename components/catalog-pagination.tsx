export const CATALOG_PRODUCTS_PER_PAGE = 12;
export const CATALOG_PRODUCTS_PER_PAGE_MOBILE = 6;
/** Homepage preview: 3 rows × 3 columns on desktop */
export const HOMEPAGE_CATALOG_PRODUCTS_PER_PAGE = 9;
export const HOMEPAGE_CATALOG_PRODUCTS_PER_PAGE_MOBILE = 6;

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

type CatalogPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CatalogPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1.5 lg:gap-2"
      aria-label="Pagination du catalogue"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 lg:h-10 lg:w-10"
      >
        <MaterialIcon name="chevron_left" className="text-lg lg:text-2xl" />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onPageChange(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? "page" : undefined}
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors lg:h-10 lg:min-w-10 lg:px-3 lg:text-sm ${
            page === currentPage
              ? "bg-primary text-on-primary shadow-md shadow-primary/20"
              : "border border-outline-variant bg-white text-on-surface-variant hover:border-primary hover:text-primary"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface-variant transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 lg:h-10 lg:w-10"
      >
        <MaterialIcon name="chevron_right" className="text-lg lg:text-2xl" />
      </button>
    </nav>
  );
}
