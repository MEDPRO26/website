"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { LOGO } from "@/lib/brand";
import { homePathForRole, safePostLoginPath } from "@/lib/auth-routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type StaffLoginAudience = "admin" | "supplier";

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
    title: "Espace équipe SOS Santé",
    subtitle: "Connexion réservée à l'équipe interne.",
    wrongRole:
      "Ce portail est réservé à l'équipe SOS Santé. Utilisez l'espace fournisseurs.",
  },
  supplier: {
    title: "Espace fournisseurs",
    subtitle: "Connexion réservée aux fournisseurs partenaires.",
    wrongRole:
      "Ce portail est réservé aux fournisseurs. Utilisez l'espace équipe.",
  },
};

export function StaffLoginPage({ audience }: { audience: StaffLoginAudience }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const ensureProfile = useMutation(api.staff.ensureProfile);
  const staff = useQuery(api.staff.current, isAuthenticated ? {} : "skip");
  const copy = COPY[audience];
  const nextPath = safePostLoginPath(searchParams.get("next"), audience);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

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
    const audienceMismatch =
      (audience === "admin" && isSupplier) ||
      (audience === "supplier" && !isSupplier);

    if (audienceMismatch) {
      setError(copy.wrongRole);
      void signOut().then(() => {
        setRedirecting(false);
      });
      return;
    }

    setRedirecting(true);
    router.replace(nextPath ?? homePathForRole(staff.role));
  }, [
    audience,
    copy.wrongRole,
    isAuthenticated,
    isLoading,
    nextPath,
    redirecting,
    router,
    signOut,
    staff,
  ]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signIn("password", {
        flow: "signIn",
        email,
        password,
      });
      await ensureProfile();
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
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border/70">
              <Image
                src={LOGO.crm}
                alt="SOS Santé"
                width={56}
                height={56}
                className="size-14 object-contain"
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
                    ? "vous@sossante.ma"
                    : "contact@votre-entreprise.ma"
                }
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
                minLength={8}
                placeholder="8 caractères minimum"
              />
            </div>

            {error ? (
              <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
              disabled={submitting}
            >
              {submitting ? "Connexion…" : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            L&apos;accès est réservé aux comptes invités par l&apos;équipe SOS
            Santé.
          </p>

          <p className="mt-4 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Retour au site
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
