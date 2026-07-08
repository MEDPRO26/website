import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  clientOfferStatusValidator,
  cmsPageStatusValidator,
  cmsPageTypeValidator,
  complaintPriorityValidator,
  complaintStatusValidator,
  conversationStatusValidator,
  auditActionValidator,
  whatsappChannelStatusValidator,
  whatsappProviderValidator,
  customerStatusValidator,
  notificationTypeValidator,
  orderEventTypeValidator,
  orderStatusValidator,
  roleValidator,
  staffStatusValidator,
  supplierInvitationStatusValidator,
  supplierQuoteStatusValidator,
  supplierStatusValidator,
} from "./validators";

/**
 * SOS Santé CRM — core data model (Phase 1)
 *
 * customers ──< orders >── orderEvents
 * staff (CRM profile linked to Convex Auth user)
 */
export default defineSchema({
  ...authTables,

  staff: defineTable({
    userId: v.id("users"),
    name: v.string(),
    email: v.string(),
    role: roleValidator,
    status: staffStatusValidator,
    supplierId: v.optional(v.id("suppliers")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"])
    .index("by_supplierId", ["supplierId"]),

  customers: defineTable({
    name: v.string(),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    email: v.optional(v.string()),
    city: v.string(),
    district: v.optional(v.string()),
    address: v.optional(v.string()),
    status: customerStatusValidator,
    accentColor: v.optional(v.string()),
    source: v.string(),
    ordersCount: v.number(),
    lastOrderAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_phone", ["phone"])
    .index("by_email", ["email"])
    .index("by_city", ["city"]),

  orders: defineTable({
    ref: v.string(),
    customerId: v.id("customers"),
    clientName: v.optional(v.string()),
    status: orderStatusValidator,
    type: v.string(),
    item: v.string(),
    duration: v.optional(v.string()),
    desiredDate: v.optional(v.string()),
    slot: v.optional(v.string()),
    source: v.string(),
    pagePath: v.optional(v.string()),
    message: v.optional(v.string()),
    notes: v.optional(v.string()),
    assignedStaffId: v.optional(v.id("staff")),
    supplierId: v.optional(v.id("suppliers")),
    rentalStartAt: v.optional(v.number()),
    rentalEndAt: v.optional(v.number()),
    rentalEndingNotifiedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_ref", ["ref"])
    .index("by_status", ["status"])
    .index("by_customerId", ["customerId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_assignedStaffId", ["assignedStaffId"])
    .index("by_supplierId", ["supplierId"]),

  suppliers: defineTable({
    name: v.string(),
    type: v.string(),
    types: v.optional(v.array(v.string())),
    city: v.string(),
    zones: v.array(v.string()),
    phone: v.string(),
    whatsapp: v.optional(v.string()),
    email: v.optional(v.string()),
    status: supplierStatusValidator,
    verified: v.boolean(),
    commissionPct: v.number(),
    items: v.array(v.string()),
    services: v.array(v.string()),
    notes: v.optional(v.string()),
    responseAvg: v.optional(v.string()),
    profileComplete: v.optional(v.boolean()),
    /**
     * When false/undefined, we show a one-time popup to invite suppliers
     * to install the web app icon on their phone.
     */
    pwaInstallPromptDismissed: v.optional(v.boolean()),
    pwaInstallPromptDismissedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_city", ["city"])
    .index("by_name", ["name"]),

  supplierInvitations: defineTable({
    token: v.string(),
    email: v.string(),
    supplierId: v.id("suppliers"),
    status: supplierInvitationStatusValidator,
    invitedByStaffId: v.optional(v.id("staff")),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    acceptedByUserId: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"])
    .index("by_supplierId", ["supplierId"]),

  staffInvitations: defineTable({
    token: v.string(),
    email: v.string(),
    role: roleValidator,
    status: supplierInvitationStatusValidator,
    invitedByStaffId: v.optional(v.id("staff")),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    acceptedByUserId: v.optional(v.id("users")),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_email", ["email"]),

  orderEvents: defineTable({
    orderId: v.id("orders"),
    type: orderEventTypeValidator,
    label: v.string(),
    fromStatus: v.optional(orderStatusValidator),
    toStatus: v.optional(orderStatusValidator),
    actorStaffId: v.optional(v.id("staff")),
    createdAt: v.number(),
  }).index("by_orderId", ["orderId"]),

  orderSupplierQuotes: defineTable({
    orderId: v.id("orders"),
    supplierId: v.id("suppliers"),
    basePrice: v.number(),
    deliveryFee: v.number(),
    installFee: v.number(),
    otherFee: v.number(),
    commissionPct: v.number(),
    commissionAmount: v.optional(v.number()),
    commissionPaidAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    status: supplierQuoteStatusValidator,
    createdByStaffId: v.optional(v.id("staff")),
    submittedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_orderId", ["orderId"])
    .index("by_supplierId", ["supplierId"])
    .index("by_orderId_supplierId", ["orderId", "supplierId"]),

  clientOffers: defineTable({
    orderId: v.id("orders"),
    quoteId: v.id("orderSupplierQuotes"),
    supplierTotal: v.number(),
    commissionPct: v.number(),
    commissionAmount: v.number(),
    finalPrice: v.number(),
    message: v.string(),
    status: clientOfferStatusValidator,
    createdByStaffId: v.optional(v.id("staff")),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_orderId", ["orderId"]),

  complaints: defineTable({
    ref: v.string(),
    orderId: v.optional(v.id("orders")),
    orderRef: v.optional(v.string()),
    clientName: v.string(),
    supplierId: v.optional(v.id("suppliers")),
    supplierName: v.optional(v.string()),
    type: v.string(),
    status: complaintStatusValidator,
    priority: complaintPriorityValidator,
    assigneeStaffId: v.optional(v.id("staff")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_ref", ["ref"])
    .index("by_orderId", ["orderId"]),

  notifications: defineTable({
    type: notificationTypeValidator,
    title: v.string(),
    description: v.string(),
    read: v.boolean(),
    link: v.optional(v.string()),
    entityId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_read", ["read"])
    .index("by_createdAt", ["createdAt"]),

  whatsappChannels: defineTable({
    slug: v.string(),
    label: v.string(),
    phone: v.string(),
    purpose: v.string(),
    city: v.optional(v.string()),
    sortOrder: v.number(),
    isDefault: v.boolean(),
    status: whatsappChannelStatusValidator,
    /** Meta Cloud API — filled when API is connected */
    metaPhoneNumberId: v.optional(v.string()),
    metaWabaId: v.optional(v.string()),
    /** 360Messenger API key (one key = one WhatsApp number) */
    messenger360ApiKey: v.optional(v.string()),
    messenger360ConnectedAt: v.optional(v.number()),
    accentColor: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_sortOrder", ["sortOrder"]),

  platformSettings: defineTable({
    key: v.literal("global"),
    whatsappProvider: whatsappProviderValidator,
    defaultCity: v.optional(v.string()),
    contactEmail: v.optional(v.string()),
    seoSiteTitle: v.optional(v.string()),
    seoSiteDescription: v.optional(v.string()),
    notifyNewOrderEmail: v.optional(v.boolean()),
    notifySupplierResponseEmail: v.optional(v.boolean()),
    notifyClientAcceptedEmail: v.optional(v.boolean()),
    notifyComplaintEmail: v.optional(v.boolean()),
    notifyRentalEndingEmail: v.optional(v.boolean()),
    auditLogsEnabled: v.optional(v.boolean()),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  auditLogs: defineTable({
    actorStaffId: v.optional(v.id("staff")),
    actorName: v.string(),
    action: auditActionValidator,
    entityType: v.string(),
    entityId: v.optional(v.string()),
    entityLabel: v.string(),
    fromValue: v.optional(v.string()),
    toValue: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  conversations: defineTable({
    name: v.string(),
    phone: v.string(),
    channelId: v.optional(v.id("whatsappChannels")),
    customerId: v.optional(v.id("customers")),
    orderId: v.optional(v.id("orders")),
    orderRef: v.optional(v.string()),
    status: conversationStatusValidator,
    lastMessage: v.string(),
    lastMessageAt: v.number(),
    unreadCount: v.number(),
    notes: v.optional(v.string()),
    clientAccentColor: v.optional(v.string()),
    source: v.string(),
    offerAnchorAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_phone", ["phone"])
    .index("by_channelId_phone", ["channelId", "phone"])
    .index("by_orderId", ["orderId"])
    .index("by_channelId", ["channelId"])
    .index("by_status", ["status"])
    .index("by_lastMessageAt", ["lastMessageAt"]),

  conversationMessages: defineTable({
    conversationId: v.id("conversations"),
    from: v.union(v.literal("client"), v.literal("staff")),
    text: v.string(),
    mediaUrl: v.optional(v.string()),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaKind: v.optional(
      v.union(
        v.literal("audio"),
        v.literal("image"),
        v.literal("video"),
        v.literal("document")
      )
    ),
    externalId: v.optional(v.string()),
    ingestSource: v.optional(
      v.union(v.literal("crm"), v.literal("webhook"), v.literal("sync"))
    ),
    createdAt: v.number(),
  })
    .index("by_conversationId", ["conversationId"])
    .index("by_externalId", ["externalId"]),

  cmsPages: defineTable({
    title: v.string(),
    slug: v.string(),
    pageType: cmsPageTypeValidator,
    status: cmsPageStatusValidator,
    indexable: v.boolean(),
    h1: v.optional(v.string()),
    content: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_status", ["status"]),
});
