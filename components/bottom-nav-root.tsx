"use client";

import { usePathname } from "next/navigation";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import { AdminBottomNav } from "@/components/admin-bottom-nav";

export function BottomNavRoot() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <AdminBottomNav />;
  }

  if (pathname.startsWith("/supplier")) return null;

  return <MobileBottomNav />;
}

