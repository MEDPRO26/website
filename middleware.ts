import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
} from "@convex-dev/auth/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { X_ROBOTS_NOINDEX } from "@/lib/indexing";
import {
  ADMIN_LOGIN_PATH,
  APPORT_AFFAIRES_HOME_PATH,
  PRESTATAIRE_LOGIN_PATH,
  SUPPLIER_LOGIN_PATH,
  WORKSPACE_HOME_PATH,
} from "@/lib/auth-routes";
import { categoryParamToValue } from "@/lib/catalog-categories";
import { DEFAULT_CITY_SLUG } from "@/lib/cities";
import {
  crmAbsoluteUrl,
  isCrmHostname,
  isCrmPath,
  isDevLikeHostname,
  isPublicHostname,
  publicAbsoluteUrl,
} from "@/lib/hosts";
import {
  LEGACY_VENTE_PAGE_PATH,
  seoCategoryToCatalogParam,
  venteCategoryPath,
  venteCityPath,
  venteProductPath,
} from "@/lib/routes";
import { isProductLandingSlug } from "@/lib/product-landing-pages";

const legacyCategorySlugs = Object.keys(seoCategoryToCatalogParam);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isAdminInvite = createRouteMatcher(["/admin/invite(.*)"]);
const isWorkspaceRoute = createRouteMatcher([
  "/projets(.*)",
  "/apport-affaires/propositions(.*)",
]);
const isApportInvite = createRouteMatcher(["/apport-affaires/invite(.*)"]);
const isSupplierRoute = createRouteMatcher([
  "/supplier(.*)",
  "/prestataire(.*)",
]);
const isSupplierInvite = createRouteMatcher([
  "/supplier/invite(.*)",
  "/prestataire/invite(.*)",
]);
const isObscureLogin = createRouteMatcher([
  ADMIN_LOGIN_PATH,
  SUPPLIER_LOGIN_PATH,
  PRESTATAIRE_LOGIN_PATH,
  APPORT_AFFAIRES_HOME_PATH,
]);
const isPrivateCrmRoute = createRouteMatcher([
  "/admin(.*)",
  "/projets(.*)",
  "/apport-affaires(.*)",
  "/supplier(.*)",
  "/prestataire(.*)",
  ADMIN_LOGIN_PATH,
  SUPPLIER_LOGIN_PATH,
  PRESTATAIRE_LOGIN_PATH,
]);

function withNoIndex(response: NextResponse) {
  response.headers.set("X-Robots-Tag", X_ROBOTS_NOINDEX);
  return response;
}

/** Pretend the CRM does not exist (normal public 404). */
function hideAsNotFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/__crm-hidden";
  url.search = "";
  return withNoIndex(NextResponse.rewrite(url));
}

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url, 301);
}

function handleLegacyRedirects(request: NextRequest) {
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
      if (isProductLandingSlug(slug)) {
        return redirect(request, `/${slug}`);
      }
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

  const cat = request.nextUrl.searchParams.get("cat");
  if (cat && pathname === LEGACY_VENTE_PAGE_PATH) {
    if (cat !== "all" && categoryParamToValue[cat]) {
      return redirect(request, venteCategoryPath(cat, DEFAULT_CITY_SLUG));
    }
    return redirect(request, venteCityPath(DEFAULT_CITY_SLUG));
  }

  return null;
}

function handleHostSplit(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname, search } = request.nextUrl;

  if (isDevLikeHostname(host)) {
    return null;
  }

  if (isPublicHostname(host) && isCrmPath(pathname)) {
    return NextResponse.redirect(crmAbsoluteUrl(pathname, search), 308);
  }

  if (isCrmHostname(host)) {
    if (
      pathname === "/robots.txt" ||
      pathname === "/sitemap.xml" ||
      pathname.startsWith("/sitemap/")
    ) {
      return "crm";
    }
    if (pathname === "/" || pathname === "") {
      return "crm-root";
    }
    if (!isCrmPath(pathname)) {
      return NextResponse.redirect(publicAbsoluteUrl(pathname, search), 308);
    }
    return "crm";
  }

  return null;
}

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const hostSplit = handleHostSplit(request);
  if (hostSplit && hostSplit !== "crm" && hostSplit !== "crm-root") {
    return hostSplit;
  }
  const onCrmHost = hostSplit === "crm" || hostSplit === "crm-root";

  if (hostSplit === "crm-root") {
    const destination = (await convexAuth.isAuthenticated())
      ? WORKSPACE_HOME_PATH
      : ADMIN_LOGIN_PATH;
    return withNoIndex(
      NextResponse.redirect(crmAbsoluteUrl(destination), 308)
    );
  }

  if (!onCrmHost) {
    const legacyRedirect = handleLegacyRedirects(request);
    if (legacyRedirect) {
      return legacyRedirect;
    }
  }

  if (isObscureLogin(request) || isApportInvite(request)) {
    return withNoIndex(NextResponse.next());
  }

  if (
    (isAdminRoute(request) || isWorkspaceRoute(request)) &&
    !isAdminInvite(request) &&
    !(await convexAuth.isAuthenticated())
  ) {
    if (onCrmHost) {
      return withNoIndex(
        NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url), 307)
      );
    }
    return hideAsNotFound(request);
  }

  if (
    isSupplierRoute(request) &&
    !isSupplierInvite(request) &&
    !(await convexAuth.isAuthenticated())
  ) {
    if (onCrmHost) {
      const login = request.nextUrl.pathname.startsWith("/prestataire")
        ? PRESTATAIRE_LOGIN_PATH
        : SUPPLIER_LOGIN_PATH;
      return withNoIndex(
        NextResponse.redirect(new URL(login, request.url), 307)
      );
    }
    return hideAsNotFound(request);
  }

  if (isPrivateCrmRoute(request)) {
    return withNoIndex(NextResponse.next());
  }

  if (onCrmHost) {
    return withNoIndex(NextResponse.next());
  }

  return null;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
