"use client";

import Image from "next/image";
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
import { CRM_BRAND_NAME, CRM_LOGO } from "@/lib/brand";
import { APPORT_AFFAIRES_HOME_PATH } from "@/lib/auth-routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

export function ApporteurInvitePage({ token }: { token: string }) {
  const router = useRouter();
  const convex = useConvex();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const inviteToken = token.trim();
  const invite = useQuery(api.apporteurInvitations.getByToken, {
    token: inviteToken,
  });
  const authViewer = useQuery(
    api.authSession.viewer,
    isAuthenticated ? {} : "skip"
  );
  const staff = useQuery(api.staff.current, authViewer ? {} : "skip");
  const acceptInvite = useMutation(api.apporteurInvitations.accept);

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
    authViewer != null &&
    normalizeEmail(serverEmail) === normalizeEmail(inviteEmail);
  const wrongAccount =
    isAuthenticated &&
    authViewer != null &&
    invite?.valid &&
    !emailMatches;

  useEffect(() => {
    if (invite?.valid && invite.apporteurName && !name) {
      setName(invite.apporteurName);
    }
  }, [invite, name]);

  useEffect(() => {
    if (authLoading || !emailMatches || staff === undefined) return;
    if (staff?.role === "apporteur") {
      router.replace(APPORT_AFFAIRES_HOME_PATH);
    }
  }, [authLoading, emailMatches, router, staff]);

  const finishAcceptance = async () => {
    await waitForServerAuth(convex, inviteEmail);
    await acceptInvite({ token: inviteToken });
    toast.success("Compte activé. Vous pouvez saisir vos affaires.");
    router.replace(APPORT_AFFAIRES_HOME_PATH);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!invite?.valid) return;
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
        ...(mode === "signUp"
          ? { name: name.trim() || invite.apporteurName }
          : {}),
      });
      await finishAcceptance();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de créer le compte."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (invite === undefined || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invite.valid) {
    const message =
      invite.reason === "already_accepted"
        ? "Cette invitation a déjà été utilisée. Connectez-vous."
        : invite.reason === "expired"
          ? "Cette invitation a expiré."
          : "Invitation introuvable.";
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[1.75rem] border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{message}</p>
          <Button className="mt-4" onClick={() => router.push(APPORT_AFFAIRES_HOME_PATH)}>
            Connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-md rounded-[1.75rem] border border-border/60 bg-card p-8 shadow-[0_4px_6px_rgba(15,23,42,0.02),0_24px_56px_rgba(15,23,42,0.1)]">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 size-16 overflow-hidden rounded-full ring-1 ring-border/70">
            <Image src={CRM_LOGO} alt={CRM_BRAND_NAME} width={64} height={64} className="size-16 object-cover" />
          </div>
          <h1 className="text-2xl font-bold">Invitation Apport d’Affaires</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez votre mot de passe pour {invite.email}
          </p>
        </div>

        {wrongAccount ? (
          <div className="space-y-3 text-sm">
            <p>Vous êtes connecté avec un autre email. Déconnectez-vous pour accepter cette invitation.</p>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => void signOut()}
            >
              Se déconnecter
            </Button>
          </div>
        ) : isAuthenticated && emailMatches ? (
          <Button
            className="w-full"
            disabled={submitting}
            onClick={() => void finishAcceptance()}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Activer mon compte"}
          </Button>
        ) : (
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            {mode === "signUp" ? (
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={invite.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={8}
              />
            </div>
            {mode === "signUp" ? (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            ) : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : mode === "signUp" ? (
                "Créer le compte"
              ) : (
                "Se connecter"
              )}
            </Button>
            <button
              type="button"
              className="w-full text-center text-xs text-muted-foreground underline"
              onClick={() => setMode(mode === "signUp" ? "signIn" : "signUp")}
            >
              {mode === "signUp"
                ? "J’ai déjà un compte"
                : "Créer un mot de passe"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
