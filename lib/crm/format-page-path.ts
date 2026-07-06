export function formatOrderPagePath(pagePath: string) {
  const trimmed = pagePath.trim();
  if (trimmed === "/" || trimmed === "/home") return "/accueil";
  return trimmed;
}

export function normalizeOrderPagePath(pagePath?: string) {
  const trimmed = pagePath?.trim();
  if (!trimmed) return undefined;
  return formatOrderPagePath(trimmed);
}

const PAGE_PATH_ORIGIN_LABELS: Record<string, string> = {
  "/accueil": "Formulaire accueil",
  "/contact": "Formulaire contact",
  "/services": "Formulaire services",
};

export function getOrderFormOriginLabel(pagePath?: string) {
  if (!pagePath?.trim()) return null;

  const path = formatOrderPagePath(pagePath);
  const exact = PAGE_PATH_ORIGIN_LABELS[path];
  if (exact) return exact;

  if (path.startsWith("/produits/")) return "Formulaire produit";
  if (path.startsWith("/services/")) return "Formulaire service à domicile";

  return "Formulaire site";
}

export function getOrderSourceLabel(source: string, pagePath?: string) {
  const origin = getOrderFormOriginLabel(pagePath);
  if (origin && source.toLowerCase().includes("formulaire")) {
    return origin;
  }
  return source;
}

export function formatOrderOriginDisplay(source: string, pagePath?: string) {
  if (!pagePath?.trim()) return source;
  const label = getOrderSourceLabel(source, pagePath);
  return `${label} · ${formatOrderPagePath(pagePath)}`;
}
