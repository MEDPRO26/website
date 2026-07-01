"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tag } from "@/components/dashboard/status-badge";
import Link from "next/link";

type OrderAssignSupplierProps = {
  orderId: Id<"orders">;
  supplierId?: Id<"suppliers">;
  supplierName?: string | null;
};

export function OrderAssignSupplier({
  orderId,
  supplierId,
  supplierName,
}: OrderAssignSupplierProps) {
  const { canQueryAdmin } = useAdminSession();
  const suppliers = useQuery(api.suppliers.list, canQueryAdmin ? { status: "actif" } : "skip");
  const assignSupplier = useMutation(api.orders.assignSupplier);
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async (value: string) => {
    setSubmitting(true);
    try {
      await assignSupplier({
        orderId,
        supplierId: value === "none" ? undefined : (value as Id<"suppliers">),
      });
      toast.success(
        value === "none"
          ? "Fournisseur retiré."
          : "Commande envoyée au fournisseur."
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible d'affecter le fournisseur."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (supplierId && supplierName) {
    return (
      <div className="rounded-lg border border-border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href={`/admin/suppliers/${supplierId}`}
              className="font-medium text-brand hover:underline"
            >
              {supplierName}
            </Link>
            <p className="text-xs text-muted-foreground">
              Fournisseur affecté à cette commande
            </p>
          </div>
          <Tag tone="success">Affecté</Tag>
        </div>
        <div className="mt-3">
          <Label htmlFor="change-supplier" className="sr-only">
            Changer de fournisseur
          </Label>
          <Select
            value={supplierId}
            disabled={submitting || suppliers === undefined}
            onValueChange={(value) => void handleAssign(value)}
          >
            <SelectTrigger id="change-supplier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Retirer le fournisseur</SelectItem>
              {(suppliers ?? []).map((supplier) => (
                <SelectItem key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-dashed border-border p-6 text-center">
      <p className="mb-3 text-sm text-muted-foreground">Aucun fournisseur affecté</p>
      <div className="mx-auto max-w-sm space-y-2">
        <Label htmlFor="assign-supplier">Envoyer à un fournisseur</Label>
        <Select
          disabled={submitting || suppliers === undefined}
          onValueChange={(value) => void handleAssign(value)}
        >
          <SelectTrigger id="assign-supplier">
            <SelectValue placeholder="Choisir un fournisseur actif" />
          </SelectTrigger>
          <SelectContent>
            {(suppliers ?? []).map((supplier) => (
              <SelectItem key={supplier._id} value={supplier._id}>
                {supplier.name} · {supplier.city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {submitting ? (
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Envoi…
          </p>
        ) : null}
      </div>
    </div>
  );
}
