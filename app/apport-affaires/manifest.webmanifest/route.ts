import { NextResponse } from "next/server";
import { CRM_BRAND_NAME, CRM_PWA_ICONS } from "@/lib/brand";
import { APPORT_AFFAIRES_HOME_PATH } from "@/lib/auth-routes";

export function GET() {
  const manifest = {
    name: `${CRM_BRAND_NAME} - Apport d’affaires`,
    short_name: CRM_BRAND_NAME,
    description:
      "Suivez vos commissions d’apport d’affaires sur S2MBO.",
    start_url: APPORT_AFFAIRES_HOME_PATH,
    id: APPORT_AFFAIRES_HOME_PATH,
    scope: "/",
    display: "standalone",
    background_color: "#e8ecf2",
    theme_color: "#32a0f3",
    orientation: "portrait",
    icons: CRM_PWA_ICONS.map((icon) => ({ ...icon })),
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
