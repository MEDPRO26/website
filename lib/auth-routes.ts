/** Obscure public login entry points (not linked from the marketing site). */
export const ADMIN_LOGIN_PATH = "/admin-me";
export const SUPPLIER_LOGIN_PATH = "/fournisseurs";

export const ADMIN_HOME_PATH = "/admin";
export const SUPPLIER_HOME_PATH = "/supplier";

export function loginPathForRole(role: string | undefined) {
  return role === "supplier" ? SUPPLIER_LOGIN_PATH : ADMIN_LOGIN_PATH;
}

export function homePathForRole(role: string | undefined) {
  return role === "supplier" ? SUPPLIER_HOME_PATH : ADMIN_HOME_PATH;
}

/** Only same-origin relative paths under the matching portal are allowed. */
export function safePostLoginPath(
  next: string | null | undefined,
  audience: "admin" | "supplier"
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
    audience === "supplier" ? SUPPLIER_HOME_PATH : ADMIN_HOME_PATH;
  if (path !== allowedPrefix && !path.startsWith(`${allowedPrefix}/`)) {
    return null;
  }
  return path;
}

/** Absolute login URL that redirects to a portal path after auth. */
export function portalLoginUrl(
  audience: "admin" | "supplier",
  nextPath: string | null | undefined,
  siteUrl: string
) {
  const base = siteUrl.replace(/\/$/, "");
  const loginPath =
    audience === "supplier" ? SUPPLIER_LOGIN_PATH : ADMIN_LOGIN_PATH;
  const safeNext = safePostLoginPath(nextPath, audience);
  if (!safeNext) {
    return `${base}${loginPath}`;
  }
  return `${base}${loginPath}?next=${encodeURIComponent(safeNext)}`;
}

/** Email/WhatsApp link: login first, then open the order after auth. */
export function supplierOrderLoginUrl(orderId: string, siteUrl: string) {
  return portalLoginUrl(
    "supplier",
    `${SUPPLIER_HOME_PATH}/orders/${orderId}`,
    siteUrl
  );
}
