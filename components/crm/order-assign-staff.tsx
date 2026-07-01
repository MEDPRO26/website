"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type OrderAssignStaffProps = {
  orderId: Id<"orders">;
  assignedStaffId?: Id<"staff">;
};

export function OrderAssignStaff({
  orderId,
  assignedStaffId,
}: OrderAssignStaffProps) {
  const { canQueryAdmin } = useAdminSession();
  const staffList = useQuery(api.staff.list, canQueryAdmin ? {} : "skip");
  const assignStaff = useMutation(api.orders.assignStaff);
  const [submitting, setSubmitting] = useState(false);

  const assignableStaff = (staffList ?? []).filter(
    (member) =>
      member.status === "actif" &&
      (member.role === "assistant" ||
        member.role === "admin" ||
        member.role === "super_admin")
  );

  const handleAssign = async (value: string) => {
    setSubmitting(true);
    try {
      await assignStaff({
        orderId,
        staffId: value === "none" ? undefined : (value as Id<"staff">),
      });
      toast.success(
        value === "none" ? "Affectation retirée." : "Assistant affecté."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'affecter l'assistant."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="assign-staff">Assistant responsable</Label>
      <Select
        value={assignedStaffId ?? "none"}
        disabled={submitting || staffList === undefined}
        onValueChange={(value) => void handleAssign(value)}
      >
        <SelectTrigger id="assign-staff" className="max-w-xs">
          <SelectValue placeholder="Choisir un assistant" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Non assigné</SelectItem>
          {assignableStaff.map((member) => (
            <SelectItem key={member._id} value={member._id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {submitting ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" />
          Mise à jour…
        </p>
      ) : null}
    </div>
  );
}
