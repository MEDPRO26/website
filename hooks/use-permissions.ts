"use client";

import { useMemo } from "react";
import {
  hasPermission,
  type Permission,
  type Role,
} from "@/lib/permissions";

export function usePermissions(role: Role = "assistant") {
  return useMemo(
    () => ({
      role,
      can: (permission: Permission) => hasPermission(role, permission),
    }),
    [role]
  );
}
