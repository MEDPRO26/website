"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect, useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import { SUPPLIER_LOGIN_PATH } from "@/lib/auth-routes";
import {
  LayoutDashboard,
  ClipboardList,
  Wallet,
  UserCog,
  Menu,
  LogOut,
  HelpCircle,
  Bell,
  Search,
  Download,
} from "lucide-react";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import { useSupplierPwaInstall } from "@/hooks/use-supplier-pwa-install";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  SupplierWebappInstallPrompt,
} from "@/components/crm/supplier-webapp-install-prompt";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LOGO } from "@/lib/brand";

const SUPPLIER_NAV: {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}[] = [
  { href: "/supplier", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/supplier/orders", label: "Mes commandes", icon: ClipboardList },
  { href: "/supplier/commissions", label: "SOS commission", icon: Wallet },
  { href: "/supplier/profile", label: "Profil", icon: UserCog },
];

function SupplierNavList({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1.5">
      {SUPPLIER_NAV.map((item) => {
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
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[#32a0f3] text-white shadow-md shadow-[#32a0f3]/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SupplierSidebar({
  supplierName,
  onNavigate,
  onSignOut,
}: {
  supplierName: string;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  const initials = supplierName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/supplier" onClick={onNavigate} className="flex items-center gap-3">
          <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm">
            <Image
              src={LOGO.crm}
              alt="SOS Santé"
              width={40}
              height={40}
              className="h-[92%] w-[92%] object-contain object-center"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white leading-tight">
              SOS Santé
            </p>
            <p className="truncate text-[11px] text-slate-400 leading-tight">
              Espace fournisseur
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <SupplierNavList onNavigate={onNavigate} />
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="bg-[#32a0f3] text-xs font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{supplierName}</p>
            <p className="truncate text-[11px] text-slate-400">Fournisseur partenaire</p>
          </div>
          <button
            type="button"
            onClick={() => void onSignOut()}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Se déconnecter"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function SupplierTopbar({
  userName,
  userInitials,
  onMenu,
  onSignOut,
}: {
  userName: string;
  userInitials: string;
  onMenu?: () => void;
  onSignOut: () => void;
}) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const q = search.trim();
    router.push(q ? `/supplier/orders?q=${encodeURIComponent(q)}` : "/supplier/orders");
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-3 border-b border-border/50 bg-white/80 px-4 py-3 backdrop-blur-md sm:px-6">
      {onMenu ? (
        <Button size="icon" variant="ghost" className="md:hidden shrink-0" onClick={onMenu}>
          <Menu className="size-5" />
        </Button>
      ) : null}

      <form onSubmit={handleSearch} className="relative min-w-0 flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une commande, un produit…"
          className="h-10 border-border/60 bg-white pl-9"
        />
      </form>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Button size="icon" variant="ghost" className="text-muted-foreground">
          <Bell className="size-5" />
        </Button>
        <Button size="icon" variant="ghost" className="text-muted-foreground">
          <HelpCircle className="size-5" />
        </Button>
        <span className="hidden sm:inline-flex items-center rounded-full bg-[#1e293b] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          Fournisseur
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full ring-2 ring-border hover:ring-brand/30 transition-all"
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-brand text-primary-foreground text-xs font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-muted-foreground">Fournisseur</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/supplier/profile">Mon profil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[var(--danger)]"
              onClick={() => void onSignOut()}
            >
              <LogOut className="mr-2 size-4" /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function SupplierShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { staff, supplier, profileComplete, sessionLoading } = useSupplierSession();
  const pwaInstall = useSupplierPwaInstall(supplier);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(SUPPLIER_LOGIN_PATH);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (
      !sessionLoading &&
      supplier &&
      !profileComplete &&
      !pathname.startsWith("/supplier/onboarding")
    ) {
      router.replace("/supplier/onboarding");
    }
  }, [sessionLoading, supplier, profileComplete, pathname, router]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Chargement de la session…</p>
      </div>
    );
  }

  if (!staff || !supplier) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-center text-sm text-muted-foreground">
          Accès fournisseur indisponible pour ce compte. Contactez SOS Santé pour
          activer votre espace.
        </p>
      </div>
    );
  }

  const userName = supplier.name;
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push(SUPPLIER_LOGIN_PATH);
  };

  return (
    <div className="supplier-portal h-[100dvh] overflow-hidden bg-[#e8ecf2]">
      <div className="flex h-full w-full">
        <aside className="hidden md:flex w-[260px] shrink-0 flex-col bg-[#111827]">
          <SupplierSidebar supplierName={userName} onSignOut={handleSignOut} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            className="w-[280px] border-0 p-0 flex flex-col bg-[#111827] text-white"
          >
            <SupplierSidebar
              supplierName={userName}
              onNavigate={() => setMobileOpen(false)}
              onSignOut={handleSignOut}
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 min-h-0 flex-1 flex-col supplier-main-bg">
          <SupplierTopbar
            userName={userName}
            userInitials={userInitials}
            onMenu={() => setMobileOpen(true)}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 min-h-0 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 pb-28 md:pb-6">
            {profileComplete ? (
              <SupplierWebappInstallPrompt install={pwaInstall} />
            ) : null}
            {children}
          </main>
        </div>
      </div>

      <nav
        className={cn(
          "md:hidden fixed bottom-3 inset-x-3 z-40 grid rounded-2xl border border-border/60 bg-white/95 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-md",
          pwaInstall.showNavInstall ? "grid-cols-5" : "grid-cols-4"
        )}
      >
        {SUPPLIER_NAV.map((item) => {
          const Icon = item.icon;
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium",
                active ? "text-brand" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" />
              {item.label === "Mes commandes"
                ? "Commandes"
                : item.label === "SOS commission"
                  ? "Commission"
                  : item.label}
            </Link>
          );
        })}
        {pwaInstall.showNavInstall ? (
          <button
            type="button"
            onClick={pwaInstall.openInstallDialog}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium text-muted-foreground"
          >
            <Download className="size-5" />
            Install app
          </button>
        ) : null}
      </nav>
    </div>
  );
}
