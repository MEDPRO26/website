/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auditLogs from "../auditLogs.js";
import type * as auth from "../auth.js";
import type * as authAdmin from "../authAdmin.js";
import type * as authSession from "../authSession.js";
import type * as cmsPages from "../cmsPages.js";
import type * as commissions from "../commissions.js";
import type * as complaints from "../complaints.js";
import type * as conversations from "../conversations.js";
import type * as crmSearch from "../crmSearch.js";
import type * as crons from "../crons.js";
import type * as customers from "../customers.js";
import type * as email from "../email.js";
import type * as http from "../http.js";
import type * as lib_audioUpload from "../lib/audioUpload.js";
import type * as lib_auditLog from "../lib/auditLog.js";
import type * as lib_authz from "../lib/authz.js";
import type * as lib_clientOffer from "../lib/clientOffer.js";
import type * as lib_createOrder from "../lib/createOrder.js";
import type * as lib_customers from "../lib/customers.js";
import type * as lib_linkSupplierStaff from "../lib/linkSupplierStaff.js";
import type * as lib_messenger360 from "../lib/messenger360.js";
import type * as lib_notifications from "../lib/notifications.js";
import type * as lib_orderEvents from "../lib/orderEvents.js";
import type * as lib_orderStatus from "../lib/orderStatus.js";
import type * as lib_pricing from "../lib/pricing.js";
import type * as lib_quotePricing from "../lib/quotePricing.js";
import type * as lib_refs from "../lib/refs.js";
import type * as lib_rentalDates from "../lib/rentalDates.js";
import type * as lib_submitSupplierQuote from "../lib/submitSupplierQuote.js";
import type * as lib_supplierProfile from "../lib/supplierProfile.js";
import type * as lib_whatsappChannelCity from "../lib/whatsappChannelCity.js";
import type * as lib_whatsappOutbound from "../lib/whatsappOutbound.js";
import type * as notifications from "../notifications.js";
import type * as orders from "../orders.js";
import type * as platformSettings from "../platformSettings.js";
import type * as quotes from "../quotes.js";
import type * as rentalReminders from "../rentalReminders.js";
import type * as staff from "../staff.js";
import type * as supplierInvitations from "../supplierInvitations.js";
import type * as supplierPortal from "../supplierPortal.js";
import type * as suppliers from "../suppliers.js";
import type * as validators from "../validators.js";
import type * as whatsappChannels from "../whatsappChannels.js";
import type * as whatsappMessenger from "../whatsappMessenger.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auditLogs: typeof auditLogs;
  auth: typeof auth;
  authAdmin: typeof authAdmin;
  authSession: typeof authSession;
  cmsPages: typeof cmsPages;
  commissions: typeof commissions;
  complaints: typeof complaints;
  conversations: typeof conversations;
  crmSearch: typeof crmSearch;
  crons: typeof crons;
  customers: typeof customers;
  email: typeof email;
  http: typeof http;
  "lib/audioUpload": typeof lib_audioUpload;
  "lib/auditLog": typeof lib_auditLog;
  "lib/authz": typeof lib_authz;
  "lib/clientOffer": typeof lib_clientOffer;
  "lib/createOrder": typeof lib_createOrder;
  "lib/customers": typeof lib_customers;
  "lib/linkSupplierStaff": typeof lib_linkSupplierStaff;
  "lib/messenger360": typeof lib_messenger360;
  "lib/notifications": typeof lib_notifications;
  "lib/orderEvents": typeof lib_orderEvents;
  "lib/orderStatus": typeof lib_orderStatus;
  "lib/pricing": typeof lib_pricing;
  "lib/quotePricing": typeof lib_quotePricing;
  "lib/refs": typeof lib_refs;
  "lib/rentalDates": typeof lib_rentalDates;
  "lib/submitSupplierQuote": typeof lib_submitSupplierQuote;
  "lib/supplierProfile": typeof lib_supplierProfile;
  "lib/whatsappChannelCity": typeof lib_whatsappChannelCity;
  "lib/whatsappOutbound": typeof lib_whatsappOutbound;
  notifications: typeof notifications;
  orders: typeof orders;
  platformSettings: typeof platformSettings;
  quotes: typeof quotes;
  rentalReminders: typeof rentalReminders;
  staff: typeof staff;
  supplierInvitations: typeof supplierInvitations;
  supplierPortal: typeof supplierPortal;
  suppliers: typeof suppliers;
  validators: typeof validators;
  whatsappChannels: typeof whatsappChannels;
  whatsappMessenger: typeof whatsappMessenger;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
