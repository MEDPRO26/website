import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { categoryParamToValue } from "@/lib/catalog-categories";
import { VENTE_PAGE_PATH } from "@/lib/routes";

export function middleware(request: NextRequest) {
  const cat = request.nextUrl.searchParams.get("cat");
  if (!cat) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.searchParams.delete("cat");

  if (cat !== "all" && categoryParamToValue[cat]) {
    url.pathname = `${VENTE_PAGE_PATH}/${cat}`;
  }

  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: "/vente-de-materiel-medical",
};
