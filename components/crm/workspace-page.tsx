"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { ArrowRight, Handshake, LogOut } from "lucide-react";
import { useEffect } from "react";
import { useAdminSession } from "@/hooks/use-admin-session";
import {
  ADMIN_LOGIN_PATH,
  SUPPLIER_HOME_PATH,
} from "@/lib/auth-routes";
import { isAdminStaffRole } from "@/lib/crm/staff-roles";
import { WORKSPACE_PROJECTS } from "@/lib/workspace-projects";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function WorkspacePage() {
  const router = useRouter();
  const { signOut } = useAuthActions();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { staff, sessionLoading } = useAdminSession();

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
        staff.role === "supplier" ? SUPPLIER_HOME_PATH : ADMIN_LOGIN_PATH
      );
    }
  }, [authLoading, isAuthenticated, staff, router]);

  if (sessionLoading || !staff || !isAdminStaffRole(staff.role)) {
    return (
      <div className="crm-app flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push(ADMIN_LOGIN_PATH);
  };

  return (
    <div className="crm-app min-h-screen bg-[var(--background)] px-4 py-8 sm:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 items-center justify-center overflow-hidden rounded-2xl bg-white px-2.5 shadow-sm ring-1 ring-border/70">
              <Image
                src="/s2mbo-logo-new.png"
                alt="S2MBO"
                width={120}
                height={32}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Workspace</p>
              <p className="text-xs text-muted-foreground">
                {staff.name}
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" onClick={() => void handleSignOut()}>
            <LogOut className="size-4" />
            Se déconnecter
          </Button>
        </header>

        <div className="text-center">
          <Image
            src="/s2mbo-logo-new.png"
            alt="S2MBO"
            width={420}
            height={96}
            priority
            className="mx-auto mb-5 h-auto w-[220px] object-contain sm:w-[280px]"
          />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Workspace
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Vos projets - ouvrez un espace de travail.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {WORKSPACE_PROJECTS.map((project) => {
            const disabled = project.status !== "active";
            const cardClass = cn(
              "flex h-full flex-col rounded-[1.75rem] border border-border/60 bg-card p-6 shadow-[0_4px_6px_rgba(15,23,42,0.02),0_24px_56px_rgba(15,23,42,0.08)] transition-all",
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[0_8px_28px_rgba(50,160,243,0.14)]"
            );

            const isExternal = project.href.startsWith("http");
            const content = (
              <>
                <div className="mb-5 flex size-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border/70">
                  {project.logoSrc ? (
                    <Image
                      src={project.logoSrc}
                      alt=""
                      width={48}
                      height={48}
                      className="size-12 object-contain"
                    />
                  ) : (
                    <Handshake className="size-7 text-brand" />
                  )}
                </div>
                <h2 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
                  {project.name}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  {disabled ? "Bientôt" : project.cta}
                  {disabled ? null : <ArrowRight className="size-4" />}
                </span>
              </>
            );

            return (
              <li key={project.id}>
                {disabled ? (
                  <div className={cardClass}>{content}</div>
                ) : isExternal ? (
                  <a href={project.href} className={cardClass}>
                    {content}
                  </a>
                ) : (
                  <Link href={project.href} className={cardClass}>
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
