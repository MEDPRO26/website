"use client";

import { ADMIN_LOGIN_PATH, SUPPLIER_LOGIN_PATH } from "@/lib/auth-routes";
import { usePathname } from "next/navigation";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { AdminBottomNav } from "@/components/admin-bottom-nav";
import { getFooterContextFromPath } from "@/lib/footer-context";
import { whatsAppHref } from "@/lib/products";

export function BottomNavRoot() {
  const pathname = usePathname();

  if (
    pathname.startsWith(ADMIN_LOGIN_PATH) ||
    pathname.startsWith(SUPPLIER_LOGIN_PATH) ||
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/invite") ||
    pathname.startsWith("/supplier")
  ) {
    return null;
  }

  if (pathname.startsWith("/admin")) {
    return <AdminBottomNav />;
  }

  const footerContext = getFooterContextFromPath(pathname ?? "/");

  return (
    <MobileBottomNav
      whatsappHref={
        footerContext.whatsappHref ?? whatsAppHref(undefined, "general")
      }
    />
  );
}

