"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { OrderStatus } from "@/lib/crm/mock-data";
import {
  ALL_ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  SUGGESTED_NEXT_STATUSES,
} from "@/lib/crm/order-status";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type OrderWorkflowActionsProps = {
  orderId: Id<"orders">;
  currentStatus: OrderStatus;
};

export function OrderWorkflowActions({
  orderId,
  currentStatus,
}: OrderWorkflowActionsProps) {
  const updateStatus = useMutation(api.orders.updateStatus);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const suggested = SUGGESTED_NEXT_STATUSES[currentStatus].filter(
    (status) => status !== currentStatus
  );

  const applyStatus = async (status: OrderStatus, statusNote?: string) => {
    if (status === currentStatus) {
      return;
    }

    setSubmitting(true);
    try {
      await updateStatus({
        orderId,
        status,
        note: statusNote?.trim() || undefined,
      });
      toast.success("Statut mis à jour.");
      setDialogOpen(false);
      setNote("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de changer le statut."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDialog = () => {
    setSelectedStatus(suggested[0] ?? currentStatus);
    setNote("");
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {suggested.map((status) => (
          <Button
            key={status}
            size="sm"
            variant="outline"
            disabled={submitting}
            onClick={() => void applyStatus(status)}
          >
            {ORDER_STATUS_LABELS[status]}
            <ArrowRight className="size-3.5 opacity-60" />
          </Button>
        ))}
        <Button size="sm" variant="secondary" disabled={submitting} onClick={openDialog}>
          Changer statut…
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Changer le statut</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <StatusBadge status={currentStatus} />
              <ArrowRight className="size-4 text-muted-foreground" />
              <StatusBadge status={selectedStatus} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order-status">Nouveau statut</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              >
                <SelectTrigger id="order-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ORDER_STATUSES.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      disabled={status === currentStatus}
                    >
                      {ORDER_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-note">Note interne (optionnel)</Label>
              <Textarea
                id="status-note"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ex. client joignable demain matin…"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              disabled={submitting || selectedStatus === currentStatus}
              onClick={() => void applyStatus(selectedStatus, note)}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Enregistrement…
                </>
              ) : (
                "Confirmer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
