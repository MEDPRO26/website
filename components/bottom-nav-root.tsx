"use client";

import { usePathname } from "next/navigation";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { AdminBottomNav } from "@/components/admin-bottom-nav";

export function BottomNavRoot() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin/login") ||
    pathname.startsWith("/admin/invite") ||
    pathname.startsWith("/supplier")
  ) {
    return null;
  }

  if (pathname.startsWith("/admin")) {
    return <AdminBottomNav />;
  }

  return <MobileBottomNav />;
}

