import type { NextConfig } from "next";
import { X_ROBOTS_NOINDEX, allowIndexing } from "./lib/indexing";

const noIndexHeaders = [{ key: "X-Robots-Tag", value: X_ROBOTS_NOINDEX }];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/location-vente-materiel-medical-agadir",
        destination: "/agadir",
        permanent: true,
      },
      {
        source: "/location-vente-materiel-medical-rabat",
        destination: "/rabat",
        permanent: true,
      },
      {
        source: "/location-vente-materiel-medical-casablanca",
        destination: "/casablanca",
        permanent: true,
      },
      {
        source: "/location-vente-materiel-medical-marrakech",
        destination: "/marrakech",
        permanent: true,
      },
      {
        source: "/location-vente-materiel-medical-tanger",
        destination: "/tanger",
        permanent: true,
      },
    ];
  },
  async headers() {
    if (allowIndexing) {
      return [];
    }

    return [
      { source: "/:path*", headers: noIndexHeaders },
      { source: "/products/:path*", headers: noIndexHeaders },
      { source: "/services/:path*", headers: noIndexHeaders },
      {
        source: "/:path*\\.(jpg|jpeg|png|webp|gif|svg|ico)",
        headers: noIndexHeaders,
      },
    ];
  },
};

export default nextConfig;
