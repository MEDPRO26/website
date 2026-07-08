import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { requireAdminPermission } from "./lib/authz";
import { logAudit } from "./lib/auditLog";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function siteUrl() {
  return process.env.SITE_URL ?? "http://localhost:3000";
}

export async function createStaffInvite(
  ctx: MutationCtx,
  args: {
    email: string;
    role: "assistant" | "admin";
    invitedByStaffId: Id<"staff">;
  }
) {
  const email = normalizeEmail(args.email);
  if (!email) {
    throw new Error("Email invalide.");
  }

  const existingStaff = (await ctx.db.query("staff").collect()).find(
    (member) => member.email.trim().toLowerCase() === email
  );
  if (existingStaff) {
    throw new Error("Un compte existe déjà pour cet email.");
  }

  const pending = await ctx.db
    .query("staffInvitations")
    .withIndex("by_email", (q) => q.eq("email", email))
    .collect();

  for (const invite of pending) {
    if (invite.status === "pending") {
      await ctx.db.patch(invite._id, { status: "cancelled" });
    }
  }

  const token = crypto.randomUUID();
  const now = Date.now();

  await ctx.db.insert("staffInvitations", {
    token,
    email,
    role: args.role,
    status: "pending",
    invitedByStaffId: args.invitedByStaffId,
    expiresAt: now + INVITE_TTL_MS,
    createdAt: now,
  });

  const inviteUrl = `${siteUrl()}/admin/invite/${token}`;

  await ctx.scheduler.runAfter(0, internal.email.sendAssistantInvitation, {
    to: email,
    inviteUrl,
    role: args.role,
  });

  return { token, inviteUrl };
}

export const inviteAssistant = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const actor = await requireAdminPermission(ctx, "users.invite");

    const result = await createStaffInvite(ctx, {
      email: args.email,
      role: "assistant",
      invitedByStaffId: actor._id,
    });

    await logAudit(ctx, {
      actorStaffId: actor._id,
      actorName: actor.name,
      action: "create",
      entityType: "staff_invite",
      entityLabel: normalizeEmail(args.email),
      toValue: "assistant",
    });

    return result;
  },
});

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invite = await ctx.db
      .query("staffInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invite) {
      return { valid: false as const, reason: "not_found" as const };
    }

    if (invite.status === "accepted") {
      return { valid: false as const, reason: "already_accepted" as const };
    }

    if (invite.status !== "pending") {
      return { valid: false as const, reason: "expired" as const };
    }

    if (invite.expiresAt < Date.now()) {
      return { valid: false as const, reason: "expired" as const };
    }

    return {
      valid: true as const,
      email: invite.email,
      role: invite.role,
      expiresAt: invite.expiresAt,
    };
  },
});

export const accept = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Connectez-vous pour accepter l'invitation.");
    }

    const invite = await ctx.db
      .query("staffInvitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!invite || invite.status !== "pending") {
      throw new Error("Invitation invalide ou déjà utilisée.");
    }

    if (invite.expiresAt < Date.now()) {
      await ctx.db.patch(invite._id, { status: "expired" });
      throw new Error("Cette invitation a expiré. Demandez un nouvel envoi.");
    }

    const authUser = await ctx.db.get(userId);
    const userEmail = authUser?.email?.toLowerCase();
    if (!userEmail || userEmail !== invite.email) {
      throw new Error(
        "Cette invitation est liée à une autre adresse email. Connectez-vous avec l'email invité."
      );
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("staff")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        role: invite.role,
        status: "actif",
        name: authUser?.name ?? existing.name,
        email: invite.email,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("staff", {
        userId,
        name: authUser?.name ?? invite.email,
        email: invite.email,
        role: invite.role,
        status: "actif",
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(invite._id, {
      status: "accepted",
      acceptedAt: now,
      acceptedByUserId: userId,
    });

    return { role: invite.role };
  },
});
