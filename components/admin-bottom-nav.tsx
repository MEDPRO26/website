"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  MessageCircle,
  Truck,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_BOTTOM_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList },
  { href: "/admin/conversations", label: "WhatsApp", icon: MessageCircle },
  { href: "/admin/suppliers", label: "Fournisseurs", icon: Truck },
  { href: "/admin/commissions", label: "Commissions", icon: Wallet },
];

export function AdminBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-outline-variant bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:hidden"
    >
      {ADMIN_BOTTOM_NAV.map((item) => {
        const Icon = item.icon;
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-lg transition-colors",
              active ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
          >
            <Icon className="size-5" />
            <span className={cn("text-[10px] leading-none", active && "font-semibold")}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

