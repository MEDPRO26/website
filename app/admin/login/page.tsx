"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function homeForRole(role: string | undefined) {
  return role === "supplier" ? "/supplier" : "/admin";
}

function loginErrorMessage(err: unknown, mode: "signIn" | "signUp"): string {
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
    return mode === "signIn"
      ? "Aucun compte pour cet email. Créez un accès admin."
      : "Compte introuvable.";
  }

  if (
    normalized.includes("already exists") ||
    normalized.includes("accountalreadyexists")
  ) {
    return "Un compte existe déjà pour cet email. Connectez-vous ou contactez le support.";
  }

  if (normalized.includes("server error")) {
    return mode === "signIn"
      ? "Connexion impossible. Vérifiez email et mot de passe, ou recréez un accès admin si l'inscription a échoué."
      : "Inscription impossible. Réessayez ou contactez le support.";
  }

  return raw || "Connexion impossible. Vérifiez vos identifiants.";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const ensureProfile = useMutation(api.staff.ensureProfile);
  const staff = useQuery(api.staff.current, isAuthenticated ? {} : "skip");

  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && staff !== undefined && !redirecting) {
      setRedirecting(true);
      router.replace(homeForRole(staff?.role));
    }
  }, [isAuthenticated, isLoading, staff, router, redirecting]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await signIn("password", {
        flow: mode,
        email,
        password,
        ...(mode === "signUp" ? { name } : {}),
      });
      // Create staff profile if missing (signup or recovery after partial signup).
      await ensureProfile();
    } catch (err) {
      setError(loginErrorMessage(err, mode));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      {redirecting ? (
        <p className="text-sm text-muted-foreground">Redirection…</p>
      ) : (
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-border">
            <Image
              src={LOGO.crm}
              alt="Centre SOS Santé"
              width={56}
              height={56}
              className="size-14 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Centre SOS Santé</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connexion équipe &amp; fournisseurs partenaires
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signUp" ? (
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Prénom et nom"
              />
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="vous@sossante.ma"
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
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? "Connexion…"
              : mode === "signIn"
                ? "Se connecter"
                : "Créer mon compte"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signIn" ? (
            <>
              Premier compte admin ?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => setMode("signUp")}
              >
                Créer un accès admin
              </button>
            </>
          ) : (
            <>
              Déjà un compte ?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:underline"
                onClick={() => setMode("signIn")}
              >
                Se connecter
              </button>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Le premier compte créé devient super administrateur. Les fournisseurs
          reçoivent un accès activé par l&apos;équipe SOS Santé.
        </p>

        <p className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Retour au site
          </Link>
        </p>
      </div>
      )}
    </div>
  );
}
