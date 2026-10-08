import { NextResponse } from "next/server";
import { CRM_BRAND_NAME, CRM_PWA_ICONS } from "@/lib/brand";
import { ADMIN_LOGIN_PATH } from "@/lib/auth-routes";

export function GET() {
  const manifest = {
    name: `${CRM_BRAND_NAME} - Administration`,
    short_name: `${CRM_BRAND_NAME} Admin`,
    description:
      "Tableau de bord d’administration S2MBO : commandes, équipes et suivi.",
    start_url: ADMIN_LOGIN_PATH,
    id: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#e8ecf2",
    theme_color: "#32a0f3",
    orientation: "portrait",
    gcm_sender_id: "103953800507",
    icons: CRM_PWA_ICONS.map((icon) => ({ ...icon })),
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
