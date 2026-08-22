"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import {
  homePathForPartnerKind,
  homePathForRole,
  PRESTATAIRE_LOGIN_PATH,
  safePostLoginPath,
  SUPPLIER_LOGIN_PATH,
} from "@/lib/auth-routes";
import { resolveSupplierPartnerKind } from "@/lib/supplier-activity-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type StaffLoginAudience = "admin" | "supplier" | "prestataire" | "apporteur";

function loginErrorMessage(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "";

  const normalized = raw.toLowerCase();

  if (
    normalized.includes("invalidsecret") ||
    normalized.includes("invalid secret") ||
    normalized.includes("incorrect password")
  ) {
    return "Mot de passe incorrect.";
  }

  if (
    normalized.includes("invalidaccountid") ||
    normalized.includes("account not found") ||
    normalized.includes("could not find")
  ) {
    return "Aucun compte pour cet email. Contactez un administrateur pour recevoir une invitation.";
  }

  if (normalized.includes("invitation")) {
    return raw;
  }

  if (normalized.includes("server error")) {
    return "Connexion impossible. Vérifiez email et mot de passe.";
  }

  return raw || "Connexion impossible. Vérifiez vos identifiants.";
}

const COPY: Record<
  StaffLoginAudience,
  { title: string; subtitle: string; wrongRole: string }
> = {
  admin: {
    title: "Espace projets",
    subtitle: "Connectez-vous pour ouvrir un projet.",
    wrongRole:
      "Ce portail est réservé à l'équipe. Utilisez l'espace partenaires.",
  },
  supplier: {
    title: "Espace fournisseurs",
    subtitle: "Connexion réservée aux fournisseurs de matériel médical.",
    wrongRole:
      "Ce portail est réservé aux fournisseurs matériel. Les prestataires soins utilisent /prestataires.",
  },
  prestataire: {
    title: "Espace prestataires",
    subtitle:
      "Connexion réservée aux prestataires de soins à domicile (infirmier, kiné, aide…).",
    wrongRole:
      "Ce portail est réservé aux prestataires soins. Les fournisseurs matériel utilisent /fournisseurs.",
  },
  apporteur: {
    title: "Espace Apport d’Affaires",
    subtitle: "Connexion réservée aux apporteurs d’affaires.",
    wrongRole:
      "Ce portail est réservé aux apporteurs d’affaires. L’équipe utilise /admin-me.",
  },
};

export function StaffLoginPage({ audience }: { audience: StaffLoginAudience }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const ensureProfile = useMutation(api.staff.ensureProfile);
  const staff = useQuery(api.staff.current, isAuthenticated ? {} : "skip");
  const partnerProfile = useQuery(
    api.supplierPortal.current,
    isAuthenticated && staff?.role === "supplier" ? {} : "skip"
  );
  const copy = COPY[audience];
  const nextPath = safePostLoginPath(searchParams.get("next"), audience);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const ensuringProfile = useRef(false);

  // After sign-in, auth can lag one tick — wait until authenticated, then
  // bootstrap the staff profile if missing (first admin / edge cases).
  useEffect(() => {
    if (
      isLoading ||
      !isAuthenticated ||
      staff !== null ||
      staff === undefined ||
      ensuringProfile.current ||
      redirecting
    ) {
      return;
    }

    ensuringProfile.current = true;
    void (async () => {
      try {
        const id = await ensureProfile();
        if (!id) {
          // Token not ready yet — allow another attempt on next render.
          ensuringProfile.current = false;
        }
      } catch (err) {
        ensuringProfile.current = false;
        setError(loginErrorMessage(err));
        void signOut();
      }
    })();
  }, [
    ensureProfile,
    isAuthenticated,
    isLoading,
    redirecting,
    signOut,
    staff,
  ]);

  useEffect(() => {
    if (
      isLoading ||
      !isAuthenticated ||
      staff === undefined ||
      redirecting
    ) {
      return;
    }

    if (staff === null) {
      return;
    }

    const isSupplier = staff.role === "supplier";
    const isApporteur = staff.role === "apporteur";

    if (audience === "admin") {
      if (isSupplier || isApporteur) {
        setError(copy.wrongRole);
        void signOut().then(() => setRedirecting(false));
        return;
      }
      setRedirecting(true);
      router.replace(nextPath ?? homePathForRole(staff.role));
      return;
    }

    if (audience === "apporteur") {
      if (!isApporteur) {
        setError(copy.wrongRole);
        void signOut().then(() => setRedirecting(false));
        return;
      }
      setRedirecting(true);
      router.replace(nextPath ?? homePathForRole("apporteur"));
      return;
    }

    if (!isSupplier) {
      setError(copy.wrongRole);
      void signOut().then(() => setRedirecting(false));
      return;
    }

    if (partnerProfile === undefined) {
      return;
    }

    if (partnerProfile === null) {
      setError(
        "Compte partenaire incomplet. Contactez un administrateur S2MBO."
      );
      void signOut().then(() => setRedirecting(false));
      return;
    }

    const partnerKind =
      resolveSupplierPartnerKind(partnerProfile.supplier) ?? "materiel";
    const isSoins = partnerKind === "soins";

    if (audience === "supplier" && isSoins) {
      setError(copy.wrongRole);
      void signOut().then(() => {
        setRedirecting(false);
        router.replace(PRESTATAIRE_LOGIN_PATH);
      });
      return;
    }

    if (audience === "prestataire" && !isSoins) {
      setError(copy.wrongRole);
      void signOut().then(() => {
        setRedirecting(false);
        router.replace(SUPPLIER_LOGIN_PATH);
      });
      return;
    }

    setRedirecting(true);
    router.replace(nextPath ?? homePathForPartnerKind(partnerKind));
  }, [
    audience,
    copy.wrongRole,
    isAuthenticated,
    isLoading,
    nextPath,
    partnerProfile,
    redirecting,
    router,
    signOut,
    staff,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    ensuringProfile.current = false;

    try {
      await signIn("password", {
        flow: "signIn",
        email,
        password,
      });
      // ensureProfile runs in useEffect once auth is ready.
    } catch (err) {
      setError(loginErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="crm-app flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      {redirecting ? (
        <p className="text-sm text-muted-foreground">Redirection…</p>
      ) : (
        <div className="w-full max-w-md rounded-[1.75rem] border border-border/60 bg-card p-8 shadow-[0_4px_6px_rgba(15,23,42,0.02),0_24px_56px_rgba(15,23,42,0.1)]">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex size-16 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-border/70">
              <Image
                src={CRM_LOGO}
                alt={CRM_BRAND_NAME}
                width={64}
                height={64}
                className="size-16 object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">{copy.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{copy.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={
                  audience === "admin"
                    ? "vous@email.com"
                    : audience === "apporteur"
                      ? "vous@email.com"
                    : audience === "prestataire"
                      ? "contact@prestataire.ma"
                      : "contact@fournisseur.ma"
                }
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}{" "}
                {audience === "supplier" ? (
                  <Link
                    href={PRESTATAIRE_LOGIN_PATH}
                    className="font-medium underline"
                  >
                    Espace prestataires
                  </Link>
                ) : null}
                {audience === "prestataire" ? (
                  <Link
                    href={SUPPLIER_LOGIN_PATH}
                    className="font-medium underline"
                  >
                    Espace fournisseurs
                  </Link>
                ) : null}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Connexion…" : "Se connecter"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
