"use client";

import { useQuery } from "convex/react";
import { Mail, UserRound } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";

export function ApporteurProfilePage() {
  const staff = useQuery(api.staff.current);

  if (staff === undefined) {
    return (
      <p className="text-sm text-muted-foreground">Chargement du profil…</p>
    );
  }

  if (!staff) {
    return (
      <p className="text-sm text-muted-foreground">Profil introuvable.</p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 sm:gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#2890e0] sm:text-3xl">
          Mon profil
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informations de votre compte apporteur d’affaires.
        </p>
      </div>

      <Card className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#eef8f1] text-[#2890e0]">
            <UserRound className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-foreground">
              {staff.name}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Apporteur d’affaires
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Nom
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {staff.name}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              E-mail
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Mail className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 break-all">{staff.email}</span>
            </p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
              Statut
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-foreground">
              {staff.status}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
