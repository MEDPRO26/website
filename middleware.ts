import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { categoryParamToValue } from "@/lib/catalog-categories";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import {
  LEGACY_VENTE_PAGE_PATH,
  seoCategoryToCatalogParam,
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";

const legacyCategorySlugs = Object.keys(seoCategoryToCatalogParam);

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url, 301);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === LEGACY_VENTE_PAGE_PATH) {
    return redirect(request, venteCityPath(DEFAULT_CITY_SLUG));
  }

  if (pathname.startsWith(`${LEGACY_VENTE_PAGE_PATH}/`)) {
    const legacyCategory = pathname.slice(LEGACY_VENTE_PAGE_PATH.length + 1);
    if (legacyCategory && categoryParamToValue[legacyCategory]) {
      return redirect(
        request,
        venteCategoryPath(legacyCategory, DEFAULT_CITY_SLUG)
      );
    }
  }

  if (pathname.startsWith("/produits/")) {
    const slug = pathname.replace("/produits/", "").replace(/\/$/, "");
    if (slug) {
      return redirect(request, venteProductPath(slug, DEFAULT_CITY_SLUG));
    }
  }

  if (legacyCategorySlugs.includes(pathname.slice(1))) {
    const catalogParam = seoCategoryToCatalogParam[pathname.slice(1)];
    if (catalogParam) {
      return redirect(
        request,
        venteCategoryPath(catalogParam, DEFAULT_CITY_SLUG)
      );
    }
  }

  if (pathname === "/location-materiel-medical-agadir") {
    return redirect(request, "/location-vente-materiel-medical-agadir");
  }

  if (pathname === "/location-materiel-medical-rabat") {
    return redirect(request, "/location-vente-materiel-medical-rabat");
  }

  if (
    pathname === "/location-materiel-medical-casablanca" ||
    pathname === "/location-materiel-medical-marrakech" ||
    pathname === "/location-materiel-medical-tanger"
  ) {
    return redirect(request, "/");
  }

  const cat = request.nextUrl.searchParams.get("cat");
  if (cat && pathname === LEGACY_VENTE_PAGE_PATH) {
    if (cat !== "all" && categoryParamToValue[cat]) {
      return redirect(request, venteCategoryPath(cat, DEFAULT_CITY_SLUG));
    }
    return redirect(request, venteCityPath(DEFAULT_CITY_SLUG));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/vente-de-materiel-medical",
    "/vente-de-materiel-medical/:path*",
    "/produits/:path*",
    "/materiel-mobilite",
    "/materiel-respiratoire",
    "/materiel-confort",
    "/materiel-diagnostic",
    "/materiel-instruments",
    "/location-materiel-medical-agadir",
    "/location-materiel-medical-rabat",
    "/location-materiel-medical-casablanca",
    "/location-materiel-medical-marrakech",
    "/location-materiel-medical-tanger",
  ],
};
