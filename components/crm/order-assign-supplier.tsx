"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Handshake } from "lucide-react";
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
import { Tag } from "@/components/dashboard/status-badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

type OrderAssignSupplierProps = {
  orderId: Id<"orders">;
  supplierId?: Id<"suppliers">;
  supplierName?: string | null;
};

type SupplierOption = {
  _id: Id<"suppliers">;
  name: string;
  city: string;
  photoUrl?: string | null;
};

function supplierInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

/** Plain logo (no Radix Avatar) so it stays visible inside Select. */
function SupplierLogo({
  name,
  photoUrl,
  size = "sm",
}: {
  name: string;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "size-11 text-sm" : size === "md" ? "size-8 text-xs" : "size-7 text-[10px]";

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt=""
        className={cn(
          sizeClass,
          "shrink-0 rounded-full object-cover object-center ring-2 ring-slate-200"
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        sizeClass,
        // Solid colors + ! so Select highlight styles cannot wash out the logo
        "inline-flex shrink-0 items-center justify-center rounded-full !bg-[#32a0f3] font-bold leading-none !text-white shadow-sm ring-2 ring-[#32a0f3]/35"
      )}
      aria-hidden
    >
      {supplierInitials(name)}
    </span>
  );
}

function SupplierSelectLabel({
  name,
  photoUrl,
  detail,
}: {
  name: string;
  photoUrl?: string | null;
  detail?: string;
}) {
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <SupplierLogo name={name} photoUrl={photoUrl} size="md" />
      <span className="truncate text-left">
        {name}
        {detail ? (
          <span className="text-muted-foreground"> · {detail}</span>
        ) : null}
      </span>
    </span>
  );
}

export function OrderAssignSupplier({
  orderId,
  supplierId,
  supplierName,
}: OrderAssignSupplierProps) {
  const { canQueryAdmin } = useAdminSession();
  const suppliers = useQuery(
    api.suppliers.list,
    canQueryAdmin ? { status: "actif" } : "skip"
  ) as SupplierOption[] | undefined;
  const assignSupplier = useMutation(api.orders.assignSupplier);
  const [submitting, setSubmitting] = useState(false);

  const selected = (suppliers ?? []).find((s) => s._id === supplierId);
  const selectedPhotoUrl = selected?.photoUrl ?? null;
  const selectedName = selected?.name ?? supplierName ?? "";

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
      <div className="rounded-xl border border-success/20 bg-success-soft/20 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SupplierLogo
              name={selectedName || supplierName}
              photoUrl={selectedPhotoUrl}
              size="lg"
            />
            <div>
              <Link
                href={`/admin/suppliers/${supplierId}`}
                className="font-semibold text-brand hover:underline"
              >
                {supplierName}
              </Link>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Handshake className="size-3" />
                Fournisseur certifié
              </p>
            </div>
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
            <SelectTrigger id="change-supplier" className="h-12 [&>span]:line-clamp-none">
              <SupplierSelectLabel
                name={selectedName || supplierName}
                photoUrl={selectedPhotoUrl}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Retirer le fournisseur</SelectItem>
              {(suppliers ?? []).map((supplier) => (
                <SelectItem
                  key={supplier._id}
                  value={supplier._id}
                  className="py-2.5 pl-2"
                  textValue={supplier.name}
                >
                  <SupplierSelectLabel
                    name={supplier.name}
                    photoUrl={supplier.photoUrl}
                  />
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
          <SelectTrigger id="assign-supplier" className="h-12 [&>span]:line-clamp-none">
            <SelectValue placeholder="Choisir un fournisseur actif" />
          </SelectTrigger>
          <SelectContent>
            {(suppliers ?? []).map((supplier) => (
              <SelectItem
                key={supplier._id}
                value={supplier._id}
                className="py-2.5 pl-2"
                textValue={`${supplier.name} ${supplier.city}`}
              >
                <SupplierSelectLabel
                  name={supplier.name}
                  photoUrl={supplier.photoUrl}
                  detail={supplier.city}
                />
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
