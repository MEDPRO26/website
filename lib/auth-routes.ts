/** Obscure public login entry points (not linked from the marketing site). */
export const ADMIN_LOGIN_PATH = "/admin-me";
export const SUPPLIER_LOGIN_PATH = "/fournisseurs";
export const PRESTATAIRE_LOGIN_PATH = "/prestataires";

export const ADMIN_HOME_PATH = "/admin";
export const WORKSPACE_HOME_PATH = "/projets";
export const APPORT_AFFAIRES_LOGIN_PATH = "/apport-affaires";
export const APPORT_AFFAIRES_HOME_PATH = "/apport-affaires";
export const APPORT_AFFAIRES_PROFILE_PATH = "/apport-affaires/profil";
export const APPORT_AFFAIRES_SUBMIT_PATH = "/apport-affaires/propositions";
export const SUPPLIER_HOME_PATH = "/supplier";
export const PRESTATAIRE_HOME_PATH = "/prestataire";

export type PartnerPortalKind = "materiel" | "soins";

export function loginPathForRole(role: string | undefined) {
  if (role === "supplier") return SUPPLIER_LOGIN_PATH;
  if (role === "apporteur") return APPORT_AFFAIRES_LOGIN_PATH;
  return ADMIN_LOGIN_PATH;
}

export function loginPathForPartnerKind(partnerKind?: string | null) {
  return partnerKind === "soins"
    ? PRESTATAIRE_LOGIN_PATH
    : SUPPLIER_LOGIN_PATH;
}

export function homePathForRole(role: string | undefined) {
  if (role === "supplier") return SUPPLIER_HOME_PATH;
  if (role === "apporteur") return APPORT_AFFAIRES_HOME_PATH;
  return WORKSPACE_HOME_PATH;
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
  audience: "admin" | "supplier" | "prestataire" | "apporteur"
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

  const allowedPrefixes =
    audience === "admin"
      ? [ADMIN_HOME_PATH, WORKSPACE_HOME_PATH, APPORT_AFFAIRES_HOME_PATH]
      : audience === "prestataire"
        ? [PRESTATAIRE_HOME_PATH]
        : audience === "apporteur"
          ? [APPORT_AFFAIRES_HOME_PATH]
          : [SUPPLIER_HOME_PATH];
  const allowed = allowedPrefixes.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  if (!allowed) {
    return null;
  }
  return path;
}

/** Absolute login URL that redirects to a portal path after auth. */
export function portalLoginUrl(
  audience: "admin" | "supplier" | "prestataire" | "apporteur",
  nextPath: string | null | undefined,
  siteUrl: string
) {
  const base = siteUrl.replace(/\/$/, "");
  const loginPath =
    audience === "admin"
      ? ADMIN_LOGIN_PATH
      : audience === "prestataire"
        ? PRESTATAIRE_LOGIN_PATH
        : audience === "apporteur"
          ? APPORT_AFFAIRES_LOGIN_PATH
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
