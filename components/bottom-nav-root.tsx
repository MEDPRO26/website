"use client";

import { usePathname } from "next/navigation";
import MobileBottomNav from "@/components/mobile-bottom-nav";

export function BottomNavRoot() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/supplier")) {
    return null;
  }

  return <MobileBottomNav />;
}

