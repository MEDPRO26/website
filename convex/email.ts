"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

function buildInviteEmailHtml(args: {
  supplierName: string;
  inviteUrl: string;
}) {
  const loginUrl = `${(process.env.SITE_URL ?? "https://www.sossante.ma").replace(/\/$/, "")}/fournisseurs`;
  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #474b56; max-width: 560px; margin: 0 auto; padding: 24px;">
    <h1 style="color: #2890e0; font-size: 22px;">Centre SOS Santé</h1>
    <p>Bonjour,</p>
    <p>
      Vous êtes invité à rejoindre l'espace fournisseur partenaire SOS Santé pour
      <strong>${args.supplierName}</strong>.
    </p>
    <p>
      Cliquez sur le bouton ci-dessous pour créer votre mot de passe et accéder
      à votre tableau de bord fournisseur.
    </p>
    <p style="margin: 32px 0;">
      <a href="${args.inviteUrl}"
         style="background: #32a0f3; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">
        Accepter l'invitation
      </a>
    </p>
    <p style="font-size: 13px; color: #747782;">
      Ce lien expire dans 7 jours. Si vous n'êtes pas concerné, ignorez cet email.
    </p>
    <p style="font-size: 13px; color: #747782;">
      Lien direct : <a href="${args.inviteUrl}">${args.inviteUrl}</a>
    </p>
    <p style="font-size: 13px; color: #747782;">
      Pour vos prochaines connexions : <a href="${loginUrl}">${loginUrl}</a>
    </p>
  </body>
</html>`;
}

function buildSupplierOrderAssignmentHtml(args: {
  supplierName: string;
  orderRef: string;
  orderUrl: string;
  clientName?: string;
  clientPhone?: string;
}) {
  const clientBlock =
    args.clientName || args.clientPhone
      ? `<p style="margin-top: 10px;"><strong>Client :</strong> ${args.clientName ?? "—"}${
          args.clientPhone ? ` · ${args.clientPhone}` : ""
        }</p>`
      : "";
  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #474b56; max-width: 560px; margin: 0 auto; padding: 24px;">
    <h1 style="color: #2890e0; font-size: 22px;">Centre SOS Santé</h1>
    <p>Bonjour <strong>${args.supplierName}</strong>,</p>
    <p>
      Une nouvelle commande vous a été affectée : <strong>${args.orderRef}</strong>.
    </p>
    ${clientBlock}
    <p>
      Connectez-vous via votre espace fournisseurs pour consulter les détails
      et envoyer votre offre de prix.
    </p>
    <p style="margin: 32px 0;">
      <a href="${args.orderUrl}"
         style="background: #32a0f3; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">
        Voir la commande
      </a>
    </p>
    <p style="font-size: 13px; color: #747782;">
      Lien direct : <a href="${args.orderUrl}">${args.orderUrl}</a>
    </p>
  </body>
</html>`;
}

function buildStaffNotificationHtml(args: {
  description: string;
  link: string;
}) {
  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #474b56; max-width: 560px; margin: 0 auto; padding: 24px;">
    <h1 style="color: #2890e0; font-size: 20px;">SOS Santé CRM</h1>
    <p>${args.description}</p>
    <p style="margin: 24px 0;">
      <a href="${args.link}"
         style="background: #32a0f3; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; display: inline-block;">
        Ouvrir dans le CRM
      </a>
    </p>
  </body>
</html>`;
}

async function sendResendEmail(args: {
  to: string | string[];
  subject: string;
  html: string;
  devLabel: string;
  devPayload: Record<string, unknown>;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.EMAIL_FROM ?? "Centre SOS Santé <onboarding@resend.dev>";

  if (!apiKey) {
    console.log(`[DEV] ${args.devLabel} (RESEND_API_KEY not set):`, args.devPayload);
    return { sent: false, dev: true };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: args.to,
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Envoi email échoué (${response.status}): ${body}`);
  }

  return { sent: true, dev: false };
}

function buildAssistantInviteEmailHtml(args: {
  inviteUrl: string;
  role: string;
}) {
  const roleLabel = args.role === "admin" ? "administrateur" : "assistant";
  const loginUrl = `${(process.env.SITE_URL ?? "https://www.sossante.ma").replace(/\/$/, "")}/admin-me`;
  return `
<!DOCTYPE html>
<html lang="fr">
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #474b56; max-width: 560px; margin: 0 auto; padding: 24px;">
    <h1 style="color: #2890e0; font-size: 22px;">Centre SOS Santé</h1>
    <p>Bonjour,</p>
    <p>
      Vous êtes invité à rejoindre l'équipe SOS Santé en tant que
      <strong>${roleLabel}</strong>.
    </p>
    <p>
      Cliquez sur le bouton ci-dessous pour créer votre mot de passe et accéder
      au tableau de bord.
    </p>
    <p style="margin: 32px 0;">
      <a href="${args.inviteUrl}"
         style="background: #32a0f3; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; display: inline-block;">
        Créer mon compte
      </a>
    </p>
    <p style="font-size: 13px; color: #747782;">
      Ce lien expire dans 7 jours. Si vous n'êtes pas concerné, ignorez cet email.
    </p>
    <p style="font-size: 13px; color: #747782;">
      Lien direct : <a href="${args.inviteUrl}">${args.inviteUrl}</a>
    </p>
    <p style="font-size: 13px; color: #747782;">
      Pour vos prochaines connexions : <a href="${loginUrl}">${loginUrl}</a>
    </p>
  </body>
</html>`;
}

export const sendAssistantInvitation = internalAction({
  args: {
    to: v.string(),
    inviteUrl: v.string(),
    role: v.string(),
  },
  handler: async (_ctx, args) => {
    return await sendResendEmail({
      to: args.to,
      subject: "Invitation équipe SOS Santé",
      html: buildAssistantInviteEmailHtml(args),
      devLabel: "Assistant invitation email",
      devPayload: args,
    });
  },
});

export const sendSupplierInvitation = internalAction({
  args: {
    to: v.string(),
    supplierName: v.string(),
    inviteUrl: v.string(),
  },
  handler: async (_ctx, args) => {
    return await sendResendEmail({
      to: args.to,
      subject: `Invitation espace fournisseur — ${args.supplierName}`,
      html: buildInviteEmailHtml(args),
      devLabel: "Supplier invitation email",
      devPayload: args,
    });
  },
});

export const sendSupplierOrderAssignment = internalAction({
  args: {
    to: v.string(),
    supplierName: v.string(),
    orderRef: v.string(),
    orderUrl: v.string(),
    clientName: v.optional(v.string()),
    clientPhone: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    return await sendResendEmail({
      to: args.to,
      subject: `Nouvelle commande affectée — ${args.orderRef}`,
      html: buildSupplierOrderAssignmentHtml(args),
      devLabel: "Supplier order assignment email",
      devPayload: args,
    });
  },
});

export const sendStaffNotification = internalAction({
  args: {
    to: v.array(v.string()),
    subject: v.string(),
    description: v.string(),
    link: v.string(),
  },
  handler: async (_ctx, args) => {
    if (args.to.length === 0) {
      return { sent: false, dev: true };
    }

    return await sendResendEmail({
      to: args.to,
      subject: args.subject,
      html: buildStaffNotificationHtml({
        description: args.description,
        link: args.link,
      }),
      devLabel: "Staff notification email",
      devPayload: args,
    });
  },
});
