import type { MetadataRoute } from "next";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import { SUPPLIER_LOGIN_PATH } from "@/lib/auth-routes";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${CRM_BRAND_NAME} - Espace partenaire`,
    short_name: CRM_BRAND_NAME,
    description:
      "Accédez à vos commandes et à votre tableau de bord partenaire.",
    // Open login first; already-logged-in suppliers are redirected to /supplier.
    start_url: SUPPLIER_LOGIN_PATH,
    id: "/fournisseurs",
    scope: "/",
    display: "standalone",
    background_color: "#e8ecf2",
    theme_color: "#32a0f3",
    orientation: "portrait",
    // Chrome's reserved Web Push sender. Helps Android wake the PWA when closed.
    gcm_sender_id: "103953800507",
    icons: [
      {
        src: CRM_LOGO,
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/notification-badge.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "monochrome",
      },
    ],
  } as MetadataRoute.Manifest;
}
