/** Obscure public login entry points (not linked from the marketing site). */
export const ADMIN_LOGIN_PATH = "/admin-me";
export const SUPPLIER_LOGIN_PATH = "/fournisseurs";
export const PRESTATAIRE_LOGIN_PATH = "/prestataires";

export const ADMIN_HOME_PATH = "/admin";
export const SUPPLIER_HOME_PATH = "/supplier";
export const PRESTATAIRE_HOME_PATH = "/prestataire";

export type PartnerPortalKind = "materiel" | "soins";

export function loginPathForRole(role: string | undefined) {
  return role === "supplier" ? SUPPLIER_LOGIN_PATH : ADMIN_LOGIN_PATH;
}

export function loginPathForPartnerKind(partnerKind?: string | null) {
  return partnerKind === "soins"
    ? PRESTATAIRE_LOGIN_PATH
    : SUPPLIER_LOGIN_PATH;
}

export function homePathForRole(role: string | undefined) {
  return role === "supplier" ? SUPPLIER_HOME_PATH : ADMIN_HOME_PATH;
}

export function homePathForPartnerKind(partnerKind?: string | null) {
  return partnerKind === "soins"
    ? PRESTATAIRE_HOME_PATH
    : SUPPLIER_HOME_PATH;
}

export function partnerPortalBaseFromPath(pathname: string) {
  if (
    pathname === PRESTATAIRE_HOME_PATH ||
    pathname.startsWith(`${PRESTATAIRE_HOME_PATH}/`)
  ) {
    return PRESTATAIRE_HOME_PATH;
  }
  return SUPPLIER_HOME_PATH;
}

export function partnerKindFromPortalPath(pathname: string): PartnerPortalKind {
  return partnerPortalBaseFromPath(pathname) === PRESTATAIRE_HOME_PATH
    ? "soins"
    : "materiel";
}

/** Only same-origin relative paths under the matching portal are allowed. */
export function safePostLoginPath(
  next: string | null | undefined,
  audience: "admin" | "supplier" | "prestataire"
): string | null {
  if (!next) return null;
  let path = next.trim();
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      path = new URL(path).pathname + new URL(path).search;
    }
  } catch {
    return null;
  }
  if (!path.startsWith("/") || path.startsWith("//")) return null;
  if (path.includes("\\") || path.includes("..")) return null;

  const allowedPrefix =
    audience === "admin"
      ? ADMIN_HOME_PATH
      : audience === "prestataire"
        ? PRESTATAIRE_HOME_PATH
        : SUPPLIER_HOME_PATH;
  if (path !== allowedPrefix && !path.startsWith(`${allowedPrefix}/`)) {
    return null;
  }
  return path;
}

/** Absolute login URL that redirects to a portal path after auth. */
export function portalLoginUrl(
  audience: "admin" | "supplier" | "prestataire",
  nextPath: string | null | undefined,
  siteUrl: string
) {
  const base = siteUrl.replace(/\/$/, "");
  const loginPath =
    audience === "admin"
      ? ADMIN_LOGIN_PATH
      : audience === "prestataire"
        ? PRESTATAIRE_LOGIN_PATH
        : SUPPLIER_LOGIN_PATH;
  const safeNext = safePostLoginPath(nextPath, audience);
  if (!safeNext) {
    return `${base}${loginPath}`;
  }
  return `${base}${loginPath}?next=${encodeURIComponent(safeNext)}`;
}

/** Email/WhatsApp link: login first, then open the order after auth. */
export function supplierOrderLoginUrl(
  orderId: string,
  siteUrl: string,
  partnerKind?: string | null
) {
  const isSoins = partnerKind === "soins";
  return portalLoginUrl(
    isSoins ? "prestataire" : "supplier",
    `${isSoins ? PRESTATAIRE_HOME_PATH : SUPPLIER_HOME_PATH}/orders/${orderId}`,
    siteUrl
  );
}
