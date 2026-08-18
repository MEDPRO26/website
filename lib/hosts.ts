/** Public marketing site. Forms and SEO stay here. */
export const PUBLIC_SITE_ORIGIN = "https://www.sossante.ma";

/** CRM (admin, fournisseurs, prestataires). */
export const CRM_SITE_ORIGIN = "https://www.s2mbo.com";

const PUBLIC_HOSTS = new Set(["sossante.ma", "www.sossante.ma"]);
const CRM_HOSTS = new Set(["s2mbo.com", "www.s2mbo.com"]);

export const CRM_PATH_PREFIXES = [
  "/admin",
  "/admin-me",
  "/supplier",
  "/prestataire",
  "/fournisseurs",
  "/prestataires",
] as const;

export function hostnameFromHostHeader(host: string | null | undefined) {
  return (host ?? "").split(":")[0].toLowerCase();
}

export function isCrmHostname(host: string | null | undefined) {
  return CRM_HOSTS.has(hostnameFromHostHeader(host));
}

export function isPublicHostname(host: string | null | undefined) {
  return PUBLIC_HOSTS.has(hostnameFromHostHeader(host));
}

/** Localhost and Vercel preview: keep both site and CRM on the same origin. */
export function isDevLikeHostname(host: string | null | undefined) {
  const h = hostnameFromHostHeader(host);
  if (!h) return true;
  if (h === "localhost" || h === "127.0.0.1") return true;
  if (h.endsWith(".vercel.app")) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h)) return true;
  return false;
}

export function isCrmPath(pathname: string) {
  return CRM_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function crmAbsoluteUrl(pathname: string, search = "") {
  return `${CRM_SITE_ORIGIN}${pathname}${search}`;
}

export function publicAbsoluteUrl(pathname: string, search = "") {
  return `${PUBLIC_SITE_ORIGIN}${pathname}${search}`;
}
