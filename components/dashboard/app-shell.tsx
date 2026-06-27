"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  FileText,
  UserCog,
  Settings,
  ScrollText,
  Search,
  Menu,
  LogOut,
  HelpCircle,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean };

export const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList },
  { href: "/admin/conversations", label: "WhatsApp", icon: MessageCircle },
  { href: "/admin/suppliers", label: "Fournisseurs", icon: Truck },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/commissions", label: "Commissions", icon: Wallet },
  { href: "/admin/cms", label: "CMS", icon: FileText },
];

const ADMIN_NAV_SECONDARY: NavItem[] = [
  { href: "/admin/complaints", label: "Réclamations", icon: AlertTriangle },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/users", label: "Utilisateurs", icon: UserCog },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit logs", icon: ScrollText },
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
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {items.map((item) => {
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

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div className="px-4 py-5 border-b border-[var(--sidebar-border)]">
        <BrandMark />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <NavList items={ADMIN_NAV} onNavigate={onNavigate} />
        <div>
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--sidebar-foreground)]">
            Système
          </p>
          <NavList items={ADMIN_NAV_SECONDARY} onNavigate={onNavigate} />
        </div>
      </nav>
      <div className="border-t border-[var(--sidebar-border)] p-4">
        <Button
          asChild
          className="w-full h-11 rounded-xl bg-[var(--sidebar-primary)] text-white hover:bg-[#2890e0] shadow-md shadow-[#32a0f3]/20 font-semibold"
        >
          <Link href="/admin/orders/new" onClick={onNavigate}>
            <Plus className="size-4" />
            Créer une commande
          </Link>
        </Button>
        <p className="mt-3 text-[10px] leading-relaxed text-[var(--sidebar-foreground)] text-center">
          Données de démonstration · ne reflètent pas l&apos;activité réelle.
        </p>
      </div>
    </>
  );
}

function Topbar({
  roleLabel,
  userName,
  userInitials,
  onMenu,
}: {
  roleLabel: string;
  userName: string;
  userInitials: string;
  onMenu?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-card px-4 py-3 sm:px-6">
      {onMenu && (
        <Button size="icon" variant="ghost" className="lg:hidden shrink-0" onClick={onMenu}>
          <Menu className="size-5" />
        </Button>
      )}
      <div className="relative hidden sm:block min-w-0 flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher une commande, un client, un fournisseur…"
          className="h-10 w-full pl-10 bg-muted/50 border-transparent focus-visible:bg-card"
        />
      </div>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Button size="icon" variant="ghost" className="relative" asChild>
          <Link href="/admin/notifications">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--danger)]" />
          </Link>
        </Button>
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
            <DropdownMenuItem className="text-[var(--danger)]">
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

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden lg:flex w-[260px] shrink-0 flex-col bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] shadow-sm">
        <SidebarContent />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[280px] p-0 flex flex-col bg-[var(--sidebar)] border-[var(--sidebar-border)]">
          <SidebarContent onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          roleLabel="Administrateur"
          userName="Dr. Agadir Admin"
          userInitials="AA"
          onMenu={() => setMobileOpen(true)}
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
          userName="Fournisseur Démo Agadir"
          userInitials="FD"
          onMenu={() => setMobileOpen(true)}
        />
        <main className="flex-1 px-4 py-4 sm:px-5 sm:py-5">{children}</main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card grid grid-cols-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {[
          { href: "/supplier", label: "Accueil", icon: LayoutDashboard, exact: true },
          { href: "/supplier/orders", label: "Commandes", icon: ClipboardList },
          { href: "/admin/notifications", label: "Chat", icon: MessageCircle },
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
