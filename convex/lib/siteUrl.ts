import { CRM_SITE_ORIGIN } from "../../lib/hosts";

/**
 * Origin for CRM invite / email / WhatsApp / push links.
 * Set Convex env `SITE_URL` to https://www.s2mbo.com in production.
 */
export function siteUrl() {
  const raw =
    process.env.SITE_URL?.trim() ||
    process.env.CRM_URL?.trim() ||
    CRM_SITE_ORIGIN;
  return raw.replace(/\/$/, "");
}
