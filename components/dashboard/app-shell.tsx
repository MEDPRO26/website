"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { useAdminSession } from "@/hooks/use-admin-session";
import { usePermissions } from "@/hooks/use-permissions";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";
import type { Permission, Role } from "@/lib/permissions";
import { useSupplierSession } from "@/hooks/use-supplier-session";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  MessageCircle,
  Truck,
  Users,
  Wallet,
  AlertTriangle,
  Bell,
  UserCog,
  Settings,
  ScrollText,
  Menu,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { GlobalSearch } from "@/components/dashboard/global-search";
import { NotificationBell } from "@/components/dashboard/notification-bell";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  permission?: Permission;
};

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList, permission: "orders.view_all" },
  { href: "/admin/conversations", label: "WhatsApp", icon: MessageCircle, permission: "whatsapp.view_conversations" },
  { href: "/admin/suppliers", label: "Fournisseurs", icon: Truck, permission: "suppliers.view" },
  { href: "/admin/customers", label: "Clients", icon: Users, permission: "customers.view" },
  { href: "/admin/commissions", label: "Commissions", icon: Wallet, permission: "commissions.view" },
];

const ADMIN_NAV_SECONDARY: NavItem[] = [
  { href: "/admin/complaints", label: "Réclamations", icon: AlertTriangle, permission: "complaints.view" },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, permission: "notifications.view" },
  { href: "/admin/users", label: "Utilisateurs", icon: UserCog, permission: "users.invite" },
  { href: "/admin/settings", label: "Paramètres", icon: Settings, permission: "settings.manage" },
  { href: "/admin/audit-logs", label: "Audit logs", icon: ScrollText, permission: "audit.view" },
];

function BrandMark() {
  const pathname = usePathname();
  const href = pathname.startsWith("/supplier") ? "/supplier" : "/admin";

  return (
    <Link href={href} className="flex items-center gap-3">
      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-[var(--sidebar-border)]">
        <Image
          src={LOGO.crm}
          alt="Centre SOS Santé"
          width={40}
          height={40}
          className="h-[92%] w-[92%] object-contain object-center"
          priority
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-[var(--sidebar-foreground-strong)] leading-tight">
          Centre SOS Santé
        </p>
        <p className="truncate text-[11px] text-[var(--sidebar-foreground)] leading-tight">
          site : sossante.ma
        </p>
      </div>
    </Link>
  );
}

function NavList({
  items,
  onNavigate,
  can,
}: {
  items: NavItem[];
  onNavigate?: () => void;
  can?: (permission: Permission) => boolean;
}) {
  const pathname = usePathname();
  const visibleItems = items.filter(
    (item) => !item.permission || !can || can(item.permission)
  );

  return (
    <ul className="space-y-1">
      {visibleItems.map((item) => {
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
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors border-l-[3px]",
                active
                  ? "border-[var(--sidebar-primary)] bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-semibold"
                  : "border-transparent text-[var(--sidebar-foreground)] hover:bg-[var(--muted)] hover:text-[var(--sidebar-foreground-strong)]"
              )}
            >
              <Icon className={cn("size-[18px] shrink-0", active ? "text-[var(--sidebar-primary)]" : "text-[var(--sidebar-foreground)]")} />
              <span className="truncate">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarContent({
  onNavigate,
  can,
}: {
  onNavigate?: () => void;
  can: (permission: Permission) => boolean;
}) {
  return (
    <>
      <div className="px-4 py-5 border-b border-[var(--sidebar-border)]">
        <BrandMark />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <NavList items={ADMIN_NAV} onNavigate={onNavigate} can={can} />
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--sidebar-foreground)]">
            Système
          </p>
          <NavList items={ADMIN_NAV_SECONDARY} onNavigate={onNavigate} can={can} />
        </div>
      </nav>
      <div className="border-t border-[var(--sidebar-border)] p-4">
        {can("orders.create_manual") ? (
          <Button
            asChild
            className="w-full h-11 rounded-xl bg-[var(--sidebar-primary)] text-white hover:bg-[#2890e0] shadow-md shadow-[#32a0f3]/20 font-semibold"
          >
            <Link href="/admin/orders/new" onClick={onNavigate}>
              <Plus className="size-4" />
              Créer une commande
            </Link>
          </Button>
        ) : null}
      </div>
    </>
  );
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  assistant: "Assistant",
  supplier: "Fournisseur",
  customer: "Client",
};

function Topbar({
  roleLabel,
  userName,
  userInitials,
  onMenu,
  onSignOut,
  showAdminTools = false,
}: {
  roleLabel: string;
  userName: string;
  userInitials: string;
  onMenu?: () => void;
  onSignOut?: () => void;
  showAdminTools?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
      {onMenu && (
        <Button size="icon" variant="ghost" className="lg:hidden shrink-0" onClick={onMenu}>
          <Menu className="size-5" />
        </Button>
      )}
      {showAdminTools ? (
        <GlobalSearch className="hidden sm:block" />
      ) : (
        <div className="hidden sm:block min-w-0 flex-1 max-w-xl" />
      )}
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        {showAdminTools ? <NotificationBell /> : null}
        <Button size="icon" variant="ghost">
          <HelpCircle className="size-5" />
        </Button>
        <div className="hidden md:block text-right">
          <p className="text-sm font-semibold text-foreground leading-tight">{userName}</p>
          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{roleLabel}</p>
        </div>
        <span className="hidden sm:inline-flex items-center rounded-md bg-[var(--sidebar-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {roleLabel}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="rounded-full ring-2 ring-border hover:ring-brand/30 transition-all">
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
              <div className="text-xs text-muted-foreground">{roleLabel}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">Paramètres</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-[var(--danger)]"
              onClick={() => void onSignOut?.()}
            >
              <LogOut className="mr-2 size-4" /> Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { staff, sessionLoading } = useAdminSession();
  const { can } = usePermissions((staff?.role ?? "assistant") as Role);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/admin/login");
      return;
    }
    if (staff && !isAdminStaffRole(staff.role)) {
      router.replace(staff.role === "supplier" ? "/supplier" : "/admin/login");
    }
  }, [authLoading, isAuthenticated, staff, router]);

  if (sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Chargement de la session…</p>
      </div>
    );
  }

  if (!staff || !isAdminStaffRole(staff.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Redirection…</p>
      </div>
    );
  }

  const userName = staff.name;
  const roleLabel = ROLE_LABELS[staff.role] ?? staff.role;
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="flex w-[260px] shrink-0 flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] shadow-sm max-lg:hidden">
        <SidebarContent can={can} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-[var(--sidebar)] border-[var(--sidebar-border)]">
          <SidebarContent onNavigate={() => setMobileOpen(false)} can={can} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          roleLabel={roleLabel}
          userName={userName}
          userInitials={userInitials}
          onMenu={() => setMobileOpen(true)}
          onSignOut={handleSignOut}
          showAdminTools
        />
        <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}

export const SUPPLIER_NAV: NavItem[] = [
  { href: "/supplier", label: "Accueil", icon: LayoutDashboard, exact: true },
  { href: "/supplier/orders", label: "Mes commandes", icon: ClipboardList },
  { href: "/supplier/profile", label: "Profil", icon: UserCog },
];

function SupplierSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="px-4 py-5 border-b border-[var(--sidebar-border)]">
        <BrandMark />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavList items={SUPPLIER_NAV} onNavigate={onNavigate} />
      </nav>
      <div className="border-t border-[var(--sidebar-border)] p-4">
        <p className="text-[10px] leading-relaxed text-[var(--sidebar-foreground)] text-center">
          Espace fournisseur partenaire · SOS Santé Agadir
        </p>
      </div>
    </>
  );
}

export function SupplierShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { staff, supplier, profileComplete, sessionLoading } = useSupplierSession();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/admin/login");
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
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen flex bg-background pb-16 md:pb-0">
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] shadow-sm">
        <SupplierSidebarContent />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-[var(--sidebar)] border-[var(--sidebar-border)]">
          <SupplierSidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          roleLabel="Fournisseur"
          userName={userName}
          userInitials={userInitials}
          onMenu={() => setMobileOpen(true)}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 px-4 py-4 sm:px-5 sm:py-5">{children}</main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card grid grid-cols-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {[
          { href: "/supplier", label: "Accueil", icon: LayoutDashboard, exact: true },
          { href: "/supplier/orders", label: "Commandes", icon: ClipboardList },
          { href: "/supplier/profile", label: "Profil", icon: UserCog },
        ].map((item) => {
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
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
