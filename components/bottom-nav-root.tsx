"use client";

import { ADMIN_LOGIN_PATH, APPORT_AFFAIRES_HOME_PATH, PRESTATAIRE_LOGIN_PATH, SUPPLIER_LOGIN_PATH } from "@/lib/auth-routes";
import { usePathname } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { AdminBottomNav } from "@/components/admin-bottom-nav";
import { getFooterContextFromPath } from "@/lib/footer-context";
import { api } from "@/convex/_generated/api";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";
import { isCrmPath } from "@/lib/hosts";
import { whatsAppHref } from "@/lib/products";

function PublicBottomNav() {
  const footerContext = getFooterContextFromPath("/");
  return (
    <MobileBottomNav
      whatsappHref={
        footerContext.whatsappHref ?? whatsAppHref(undefined, "general")
      }
    />
  );
}

export function BottomNavRoot() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const staff = useQuery(api.staff.current, isAuthenticated ? {} : "skip");
  const isAdminStaff = isAdminStaffRole(staff?.role);

  const isAdminInvite = pathname.startsWith("/admin/invite");
  const isSupplierInvite =
    pathname.startsWith("/supplier/invite") ||
    pathname.startsWith("/prestataire/invite");
  const isObscureLogin =
    pathname.startsWith(ADMIN_LOGIN_PATH) ||
    pathname.startsWith(SUPPLIER_LOGIN_PATH) ||
    pathname.startsWith(PRESTATAIRE_LOGIN_PATH) ||
    pathname.startsWith(APPORT_AFFAIRES_HOME_PATH) ||
    pathname.startsWith("/admin/login");
  const isAdminPath = pathname.startsWith("/admin");
  const isSupplierPath =
    pathname.startsWith("/supplier") || pathname.startsWith("/prestataire");

  // CRM (s2mbo.com) must not show the public SOS Santé chrome.
  if (isCrmPath(pathname ?? "/")) {
    if (isAdminInvite || isSupplierInvite || isObscureLogin) {
      return null;
    }
    if (isSupplierPath) {
      return null;
    }
    if (isAdminPath) {
      if (authLoading) return null;
      if (isAuthenticated && staff === undefined) return null;
      if (isAuthenticated && isAdminStaff) {
        return <AdminBottomNav />;
      }
      return null;
    }
    return null;
  }

  // Invite flows stay clean (no public chrome).
  if (isAdminInvite || isSupplierInvite) {
    return null;
  }

  // Public-site login URLs (localhost / preview): keep public nav.
  if (isObscureLogin) {
    return <PublicBottomNav />;
  }

  if (isSupplierPath) {
    if (authLoading) return null;
    // Unauthenticated /supplier → rewritten 404 uses public nav.
    if (!isAuthenticated) {
      return <PublicBottomNav />;
    }
    // Authenticated supplier portal has its own mobile bar.
    return null;
  }

  if (isAdminPath) {
    if (authLoading) return null;
    // Wait for staff profile only when signed in.
    if (isAuthenticated && staff === undefined) return null;
    // Only real admin sessions get the CRM bottom bar.
    if (isAuthenticated && isAdminStaff) {
      return <AdminBottomNav />;
    }
    // Logged out (or non-admin) on /admin → public site nav.
    return <PublicBottomNav />;
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