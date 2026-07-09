export const ROLES = [
  "super_admin",
  "admin",
  "assistant",
  "supplier",
  "customer",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "orders.view_all",
  "orders.view_assigned",
  "orders.create_manual",
  "orders.assign_supplier",
  "orders.update_status",
  "orders.validate_quote",
  "orders.cancel",
  "orders.delete",
  "suppliers.view",
  "suppliers.create",
  "suppliers.update",
  "suppliers.suspend",
  "suppliers.delete",
  "quotes.submit_supplier_price",
  "quotes.validate_final_price",
  "quotes.modify_commission",
  "quotes.send_to_client",
  "users.invite",
  "users.change_role",
  "users.suspend",
  "whatsapp.view_conversations",
  "whatsapp.create_order_from_conversation",
  "whatsapp.send_template",
  "whatsapp.configure_api",
  "cms.manage_pages",
  "cms.manage_blog",
  "settings.manage",
  "audit.view",
  "commissions.view",
  "commissions.manage",
  "complaints.view",
  "complaints.manage",
  "notifications.view",
  "customers.view",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/** Role → permission matrix (stub for future middleware / RLS checks). */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: PERMISSIONS,
  admin: [
    "orders.view_all",
    "orders.create_manual",
    "orders.assign_supplier",
    "orders.update_status",
    "orders.validate_quote",
    "orders.cancel",
    "suppliers.view",
    "suppliers.create",
    "suppliers.update",
    "suppliers.suspend",
    "quotes.validate_final_price",
    "quotes.modify_commission",
    "quotes.send_to_client",
    "users.invite",
    "whatsapp.view_conversations",
    "whatsapp.create_order_from_conversation",
    "whatsapp.send_template",
    "cms.manage_pages",
    "cms.manage_blog",
    "commissions.view",
    "commissions.manage",
    "complaints.view",
    "complaints.manage",
    "notifications.view",
    "customers.view",
  ],
  assistant: [
    "orders.view_assigned",
    "orders.create_manual",
    "orders.assign_supplier",
    "orders.update_status",
    "orders.validate_quote",
    "orders.cancel",
    "suppliers.view",
    "quotes.validate_final_price",
    "quotes.send_to_client",
    "whatsapp.view_conversations",
    "whatsapp.create_order_from_conversation",
    "whatsapp.send_template",
    "complaints.view",
    "complaints.manage",
    "notifications.view",
    "customers.view",
  ],
  supplier: [
    "orders.view_assigned",
    "quotes.submit_supplier_price",
    "notifications.view",
  ],
  customer: [
    "orders.view_assigned",
    "notifications.view",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessAdmin(role: Role): boolean {
  return role === "super_admin" || role === "admin" || role === "assistant";
}

export function canAccessSupplier(role: Role): boolean {
  return role === "supplier" || role === "super_admin";
}
