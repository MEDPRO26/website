"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  useConvex,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { LOGO } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AssistantInvitePageProps = {
  token: string;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function waitForServerAuth(
  convex: ReturnType<typeof useConvex>,
  expectedEmail: string
) {
  const target = normalizeEmail(expectedEmail);

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const viewer = await convex.query(api.authSession.viewer, {});
    if (viewer && normalizeEmail(viewer.email) === target) {
      return viewer;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  throw new Error(
    "Session non synchronisée. Attendez quelques secondes puis réessayez."
  );
}

export function AssistantInvitePage({ token }: AssistantInvitePageProps) {
  const router = useRouter();
  const convex = useConvex();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const invite = useQuery(api.staffInvitations.getByToken, { token });
  const authViewer = useQuery(
    api.authSession.viewer,
    isAuthenticated ? {} : "skip"
  );
  const staff = useQuery(api.staff.current, authViewer ? {} : "skip");
  const acceptInvite = useMutation(api.staffInvitations.accept);

  const [mode, setMode] = useState<"signUp" | "signIn">("signUp");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inviteEmail = invite?.valid ? invite.email : "";
  const serverEmail = authViewer?.email ?? "";
  const emailMatches =
    invite?.valid &&
    authViewer !== null &&
    authViewer !== undefined &&
    normalizeEmail(serverEmail) === normalizeEmail(inviteEmail);
  const wrongAccount =
    isAuthenticated &&
    authViewer !== undefined &&
    authViewer !== null &&
    invite?.valid &&
    !emailMatches;

  useEffect(() => {
    if (authLoading || !emailMatches || staff === undefined) {
      return;
    }
    if (staff && staff.role !== "supplier") {
      router.replace("/admin");
    }
  }, [authLoading, emailMatches, staff, router]);

  const finishAcceptance = async () => {
    await waitForServerAuth(convex, inviteEmail);
    await acceptInvite({ token });

    for (let attempt = 0; attempt < 30; attempt += 1) {
      const profile = await convex.query(api.staff.current, {});
      if (profile && profile.role !== "supplier") {
        toast.success("Compte assistant activé.");
        router.replace("/admin");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    throw new Error(
      "Compte activé mais la session met du temps à se synchroniser. Rechargez la page dans quelques secondes."
    );
  };

  const handleAuthenticatedAccept = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await finishAcceptance();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible d'accepter l'invitation."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await signOut();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de se déconnecter."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invite?.valid) {
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (mode === "signUp" && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await signIn("password", {
        flow: mode,
        email: invite.email,
        password,
        ...(mode === "signUp" ? { name: name.trim() || invite.email } : {}),
      });
      await finishAcceptance();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de créer le compte assistant."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (invite === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <p className="text-sm text-muted-foreground">Chargement de l&apos;invitation…</p>
      </div>
    );
  }

  if (!invite.valid) {
    const message =
      invite.reason === "already_accepted"
        ? "Cette invitation a déjà été acceptée."
        : invite.reason === "expired"
          ? "Cette invitation a expiré."
          : "Invitation introuvable ou invalide.";

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <h1 className="text-xl font-bold text-foreground">Invitation équipe</h1>
          <p className="mt-3 text-sm text-muted-foreground">{message}</p>
          <Button asChild className="mt-6">
            <Link href="/admin-me">Aller à la connexion</Link>
          </Button>
        </div>
      </div>
    );
  }

  const showAuthForm = !isAuthenticated || wrongAccount;
  const syncingSession =
    isAuthenticated && !wrongAccount && authViewer === undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
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
          <h1 className="text-2xl font-bold text-foreground">Invitation équipe</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez votre accès <strong>assistant</strong> pour le CRM SOS Santé.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{invite.email}</p>
        </div>

        {syncingSession ? (
          <p className="text-center text-sm text-muted-foreground">
            Synchronisation de la session…
          </p>
        ) : emailMatches && staff === undefined ? (
          <p className="text-center text-sm text-muted-foreground">Vérification du compte…</p>
        ) : emailMatches ? (
          <div className="space-y-4">
            <p className="rounded-lg bg-brand-soft/40 px-3 py-2 text-sm text-brand-deep">
              Connecté avec <strong>{invite.email}</strong> — confirmez pour activer votre
              accès.
            </p>
            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button
              className="w-full"
              disabled={submitting}
              onClick={() => void handleAuthenticatedAccept()}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Activation…
                </>
              ) : (
                "Activer mon compte"
              )}
            </Button>
          </div>
        ) : showAuthForm ? (
          <>
            {wrongAccount ? (
              <div className="mb-4 space-y-3">
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Vous êtes connecté avec <strong>{serverEmail}</strong>. Cette invitation
                  est pour <strong>{invite.email}</strong>.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={submitting}
                  onClick={() => void handleSignOut()}
                >
                  Se déconnecter et continuer
                </Button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email invité</Label>
                <Input id="email" type="email" value={invite.email} readOnly disabled />
              </div>

              {mode === "signUp" ? (
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              {mode === "signUp" ? (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>
              ) : null}

              {error ? (
                <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              ) : null}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Création du compte…
                  </>
                ) : mode === "signUp" ? (
                  "Créer mon compte assistant"
                ) : (
                  "Se connecter et activer"
                )}
              </Button>
            </form>
          </>
        ) : null}

        {showAuthForm && !wrongAccount ? (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signUp" ? (
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
            ) : (
              <>
                Première connexion ?{" "}
                <button
                  type="button"
                  className="font-semibold text-primary hover:underline"
                  onClick={() => setMode("signUp")}
                >
                  Créer un mot de passe
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
