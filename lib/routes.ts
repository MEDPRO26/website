export const VENTE_PAGE_PATH = "/vente-de-materiel-medical";

export function venteCategoryPath(categoryParam: string): string {
  if (categoryParam === "all") return VENTE_PAGE_PATH;
  return `${VENTE_PAGE_PATH}/${categoryParam}`;
}

export function isVenteCatalogPath(pathname: string): boolean {
  return (
    pathname === VENTE_PAGE_PATH ||
    pathname.startsWith(`${VENTE_PAGE_PATH}/`)
  );
}

