import { apportDemandeLoginUrl } from "../../lib/auth-routes";
import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { siteUrl } from "./siteUrl";

export async function notifyApporteurOfAssignment(
  ctx: MutationCtx,
  args: {
    apporteur: Doc<"apporteurs">;
    demande: Doc<"apportDemandes">;
    demandeId: Id<"apportDemandes">;
  }
) {
  const origin = siteUrl();
  const demandeUrl = apportDemandeLoginUrl(origin);
  const email = args.apporteur.email?.trim();
  const clientName = args.demande.clientName.trim();
  const clientPhone = args.demande.phone?.trim() || "";
  const projectType = args.demande.projectType.trim();

  await ctx.scheduler.runAfter(0, internal.webPush.sendToApporteur, {
    apporteurId: args.apporteur._id,
    title: "Nouvelle demande S2MBO",
    body: `${clientName}${projectType ? ` · ${projectType}` : ""}`,
    url: "/apport-affaires/demandes",
    tag: `demande-${args.demandeId}`,
  });

  if (email) {
    await ctx.scheduler.runAfter(0, internal.email.sendApportDemandeAssignment, {
      to: email,
      apporteurName: args.apporteur.name,
      clientName,
      clientPhone,
      projectType,
      localisation: args.demande.localisation?.trim() || undefined,
      demandeUrl,
    });
  }
}
