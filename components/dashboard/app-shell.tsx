"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";
import { useAdminSession } from "@/hooks/use-admin-session";
import { usePermissions } from "@/hooks/use-permissions";
import {
  ADMIN_LOGIN_PATH,
  APPORT_AFFAIRES_DEMANDES_PATH,
  APPORT_AFFAIRES_HOME_PATH,
  APPORT_AFFAIRES_HONORAIRES_PATH,
  APPORT_AFFAIRES_PUSH_PATH,
  APPORT_AFFAIRES_SUBMIT_PATH,
  WORKSPACE_HOME_PATH,
} from "@/lib/auth-routes";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";
import type { Permission, Role } from "@/lib/permissions";
import {
  LayoutDashboard,
  ClipboardList,
  Plus,
  MessageCircle,
  Truck,
  HeartHandshake,
  UserRound,
  Users,
  Wallet,
  BarChart3,
  AlertTriangle,
  BellRing,
  UserCog,
  Settings,
  ScrollText,
  Menu,
  LogOut,
  HelpCircle,
  LayoutGrid,
  Handshake,
  Newspaper,
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
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
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
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList },
  { href: "/admin/conversations", label: "WhatsApp", icon: MessageCircle, permission: "whatsapp.view_conversations" },
  { href: "/admin/suppliers", label: "Fournisseurs", icon: Truck, permission: "suppliers.view" },
  { href: "/admin/prestataires", label: "Prestataires", icon: HeartHandshake, permission: "suppliers.view" },
  { href: "/admin/assistants", label: "Assistants", icon: UserRound, permission: "users.invite" },
  { href: "/admin/customers", label: "Clients", icon: Users, permission: "customers.view" },
  { href: "/admin/commissions", label: "Commissions", icon: Wallet, permission: "commissions.view" },
  { href: "/admin/statistics", label: "Statistiques", icon: BarChart3, permission: "statistics.view" },
];

const ADMIN_NAV_SECONDARY: NavItem[] = [
  { href: "/admin/blog", label: "Blog", icon: Newspaper, permission: "cms.manage_blog" },
  { href: "/admin/complaints", label: "Réclamations", icon: AlertTriangle, permission: "complaints.view" },
  { href: "/admin/push-notifications", label: "Push mobile", icon: BellRing, permission: "notifications.view" },
  { href: "/admin/users", label: "Utilisateurs", icon: UserCog, permission: "users.invite" },
  { href: "/admin/settings", label: "Paramètres", icon: Settings, permission: "settings.manage" },
  { href: "/admin/audit-logs", label: "Audit logs", icon: ScrollText, permission: "audit.view" },
];

type ShellVariant = "crm" | "apport";

const APPORT_NAV: NavItem[] = [
  {
    href: APPORT_AFFAIRES_DEMANDES_PATH,
    label: "Demandes",
    icon: ClipboardList,
  },
  {
    href: APPORT_AFFAIRES_HOME_PATH,
    label: "Tableau de suivi",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: APPORT_AFFAIRES_HONORAIRES_PATH,
    label: "Honoraires",
    icon: Wallet,
  },
  {
    href: APPORT_AFFAIRES_SUBMIT_PATH,
    label: "Apport d’Affaires",
    icon: Handshake,
  },
  {
    href: APPORT_AFFAIRES_PUSH_PATH,
    label: "Push mobile",
    icon: BellRing,
    permission: "notifications.view",
  },
];

function BrandMark() {
  const pathname = usePathname();
  const href = pathname.startsWith("/apport-affaires")
    ? APPORT_AFFAIRES_HOME_PATH
    : pathname.startsWith("/supplier")
      ? "/supplier"
      : "/admin";

  return (
    <Link href={href} className="flex items-center gap-3">
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
        <p className="truncate text-sm font-bold text-[var(--sidebar-foreground-strong)] leading-tight">
          {CRM_BRAND_NAME}
        </p>
        <p className="truncate text-[11px] text-[var(--sidebar-foreground)] leading-tight">
          CRM · s2mbo.com
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
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] font-semibold shadow-sm"
                  : "text-[var(--sidebar-foreground)] hover:bg-[var(--muted)] hover:text-[var(--sidebar-foreground-strong)]"
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
  variant = "crm",
}: {
  onNavigate?: () => void;
  can: (permission: Permission) => boolean;
  variant?: ShellVariant;
}) {
  const isApport = variant === "apport";

  return (
    <>
      <div className="px-4 py-5 border-b border-[var(--sidebar-border)]/70">
        <BrandMark />
        <Link
          href={WORKSPACE_HOME_PATH}
          onClick={onNavigate}
          className="mt-3 flex items-center gap-2 rounded-xl px-1 py-1.5 text-xs font-medium text-[var(--sidebar-foreground)] hover:bg-[var(--muted)] hover:text-[var(--sidebar-foreground-strong)]"
        >
          <LayoutGrid className="size-3.5" />
          Tous les projets
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {isApport ? (
          <NavList items={APPORT_NAV} onNavigate={onNavigate} can={can} />
        ) : (
          <>
            <NavList items={ADMIN_NAV} onNavigate={onNavigate} can={can} />
            <div>
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--sidebar-foreground)]">
                Système
              </p>
              <NavList items={ADMIN_NAV_SECONDARY} onNavigate={onNavigate} can={can} />
            </div>
          </>
        )}
      </nav>
      {isApport ? (
        <div className="border-t border-[var(--sidebar-border)]/70 p-4" />
      ) : (
        <div className="border-t border-[var(--sidebar-border)]/70 p-4">
          {can("orders.create_manual") ? (
            <Button
              asChild
              className="w-full h-11 rounded-xl bg-[var(--sidebar-primary)] text-white hover:bg-[#2890e0] shadow-md shadow-[#32a0f3]/25 font-semibold"
            >
              <Link href="/admin/orders/new" onClick={onNavigate}>
                <Plus className="size-4" />
                Créer une commande
              </Link>
            </Button>
          ) : null}
        </div>
      )}
    </>
  );
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super administrateur",
  admin: "Administrateur",
  assistant: "Assistant",
  supplier: "Fournisseur",
  apporteur: "Apporteur d’affaires",
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
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border/60 bg-card/90 px-4 py-3 backdrop-blur-md sm:px-6">
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
        <span className="hidden sm:inline-flex items-center rounded-full bg-[var(--sidebar-primary)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
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
              <Link href={WORKSPACE_HOME_PATH}>
                <LayoutGrid className="mr-2 size-4" /> Mes projets
              </Link>
            </DropdownMenuItem>
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

export function AdminShell({
  children,
  variant = "crm",
}: {
  children: ReactNode;
  variant?: ShellVariant;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { staff, sessionLoading } = useAdminSession();
  const { can } = usePermissions((staff?.role ?? "assistant") as Role);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace(ADMIN_LOGIN_PATH);
      return;
    }
    if (!authLoading && isAuthenticated && staff === null) {
      router.replace(ADMIN_LOGIN_PATH);
      return;
    }
    if (staff && !isAdminStaffRole(staff.role)) {
      router.replace(
        staff.role === "supplier"
          ? "/supplier"
          : staff.role === "apporteur"
            ? APPORT_AFFAIRES_HOME_PATH
            : ADMIN_LOGIN_PATH
      );
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
    router.push(ADMIN_LOGIN_PATH);
  };

  return (
    <div className="min-h-screen bg-background p-1 sm:p-1.5">
      <div className="flex min-h-[calc(100dvh-0.5rem)] w-full overflow-hidden rounded-2xl border border-border/50 bg-card shadow-[0_4px_6px_rgba(15,23,42,0.02),0_20px_48px_rgba(15,23,42,0.08)] sm:min-h-[calc(100dvh-0.75rem)]">
        <aside className="flex w-[260px] shrink-0 flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)]/70 max-lg:hidden">
          <SidebarContent can={can} variant={variant} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent
            side="left"
            style={{ backgroundColor: "#ffffff" }}
            className="crm-app w-[280px] p-0 flex flex-col border-[#e2e5eb] rounded-r-2xl"
          >
            <SidebarContent
              onNavigate={() => setMobileOpen(false)}
              can={can}
              variant={variant}
            />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col bg-background/50">
          <Topbar
            roleLabel={roleLabel}
            userName={userName}
            userInitials={userInitials}
            onMenu={() => setMobileOpen(true)}
            onSignOut={handleSignOut}
            showAdminTools={variant === "crm"}
          />
          <main className="min-w-0 flex-1 overflow-auto px-3 py-4 pb-24 sm:px-6 sm:py-6 md:pb-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

