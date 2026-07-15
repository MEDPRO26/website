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
