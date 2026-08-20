"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { api } from "@/convex/_generated/api";
import {
  APPORT_AFFAIRES_HOME_PATH,
  APPORT_AFFAIRES_LOGIN_PATH,
  APPORT_AFFAIRES_PROFILE_PATH,
} from "@/lib/auth-routes";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const APPORTEUR_NAV = [
  {
    href: APPORT_AFFAIRES_HOME_PATH,
    label: "Tableau de bord",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: APPORT_AFFAIRES_PROFILE_PATH,
    label: "Profil",
    icon: UserRound,
  },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {APPORTEUR_NAV.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-semibold shadow-sm"
                  : "text-[var(--sidebar-foreground)] hover:bg-[var(--muted)] hover:text-[var(--sidebar-foreground-strong)]"
              )}
            >
              <Icon
                className={cn(
                  "size-[18px] shrink-0",
                  active
                    ? "text-[var(--sidebar-primary)]"
                    : "text-[var(--sidebar-foreground)]"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const staff = useQuery(api.staff.current);

  return (
    <>
      <div className="border-b border-[var(--sidebar-border)]/70 px-4 py-5">
        <Link
          href={APPORT_AFFAIRES_HOME_PATH}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-[var(--sidebar-border)]/80">
            <Image
              src={CRM_LOGO}
              alt={CRM_BRAND_NAME}
              width={40}
              height={40}
              className="size-full object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight text-[var(--sidebar-foreground-strong)]">
              {CRM_BRAND_NAME}
            </p>
            <p className="truncate text-[11px] leading-tight text-[var(--sidebar-foreground)]">
              {staff?.name ?? "Apporteur d’affaires"}
            </p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <NavList onNavigate={onNavigate} />
      </nav>
    </>
  );
}

export function ApporteurShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuthActions();
  const staff = useQuery(api.staff.current);

  const userName = staff?.name ?? "Apporteur";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push(APPORT_AFFAIRES_LOGIN_PATH);
  };

  return (
    <div className="min-h-screen bg-background p-1 sm:p-1.5">
      <div className="flex min-h-[calc(100dvh-0.5rem)] w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_4px_6px_rgba(15,23,42,0.02),0_20px_48px_rgba(15,23,42,0.08)] sm:min-h-[calc(100dvh-0.75rem)]">
        <aside className="flex w-[260px] shrink-0 flex-col border-r border-[var(--sidebar-border)]/70 bg-[var(--sidebar)] max-lg:hidden">
          <SidebarContent />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            style={{ backgroundColor: "#ffffff" }}
            className="crm-app flex w-[280px] flex-col rounded-r-2xl border-[#e2e5eb] p-0"
          >
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col bg-background/50">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/50 bg-white/80 px-3 py-3 backdrop-blur-md sm:px-6">
            <Button
              size="icon"
              variant="ghost"
              className="shrink-0 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {userName}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                Apporteur d’affaires
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full ring-2 ring-border transition-all hover:ring-brand/30"
                >
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-brand text-xs font-semibold text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{userName}</div>
                  <div className="text-xs text-muted-foreground">
                    Apporteur d’affaires
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={APPORT_AFFAIRES_PROFILE_PATH}>Mon profil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-[var(--danger)]"
                  onClick={() => void handleSignOut()}
                >
                  <LogOut className="mr-2 size-4" /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>
          <main className="min-w-0 flex-1 overflow-auto px-3 py-4 pb-24 sm:px-6 sm:py-6 md:pb-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
