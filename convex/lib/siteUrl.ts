/** Public site origin for invite / notification links (Convex env: SITE_URL). */
export function siteUrl() {
  const raw = process.env.SITE_URL?.trim() || "https://sossante.ma";
  return raw.replace(/\/$/, "");
}
