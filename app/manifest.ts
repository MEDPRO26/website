import type { MetadataRoute } from "next";
import { SITE_DISPLAY_NAME } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_DISPLAY_NAME} — Espace fournisseur`,
    short_name: "SOS Fournisseur",
    description:
      "Accédez à vos commandes et à votre tableau de bord fournisseur SOS Santé.",
    start_url: "/supplier",
    scope: "/",
    display: "standalone",
    background_color: "#e8ecf2",
    theme_color: "#32a0f3",
    orientation: "portrait",
    icons: [
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
    ],
  };
}
