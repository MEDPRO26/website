"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FrenchDatePicker } from "@/components/ui/french-date-picker";
import { FrenchTimePicker } from "@/components/ui/french-time-picker";
import {
  formatDesiredDateRange,
  formatDurationFromDateRange,
  formatTimeSlotRange,
  parseDesiredDateRangeToIso,
  parseSlotToTimeSlotInput,
  validateDesiredDateRange,
  validateTimeSlotRange,
} from "@/lib/crm/order-scheduling";

type SupplierOrderSchedulingEditorProps = {
  orderId: Id<"orders">;
  desiredDate?: string | null;
  slot?: string | null;
  readOnly?: boolean;
  onSaved?: () => void;
};

export function SupplierOrderSchedulingEditor({
  orderId,
  desiredDate,
  slot,
  readOnly = false,
  onSaved,
}: SupplierOrderSchedulingEditorProps) {
  const updateScheduling = useMutation(api.supplierPortal.updateOrderScheduling);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const { from, to } = parseDesiredDateRangeToIso(desiredDate);
    const times = parseSlotToTimeSlotInput(slot);
    setDateFrom(from);
    setDateTo(to);
    setTimeFrom(times.from);
    setTimeTo(times.to);
  }, [desiredDate, slot]);

  const handleSave = async () => {
    const dateError = validateDesiredDateRange(dateFrom, dateTo);
    if (dateError) {
      toast.error(dateError);
      return;
    }

    const timeError = validateTimeSlotRange(timeFrom, timeTo);
    if (timeError) {
      toast.error(timeError);
      return;
    }

    if (!dateFrom.trim() || !dateTo.trim()) {
      toast.error("Indiquez la période confirmée avec le client (du et au).");
      return;
    }

    if (!timeFrom.trim() || !timeTo.trim()) {
      toast.error("Indiquez le créneau horaire confirmé avec le client.");
      return;
    }

    const formattedDate = formatDesiredDateRange(dateFrom, dateTo);
    const formattedSlot = formatTimeSlotRange(timeFrom, timeTo);
    const duration = formatDurationFromDateRange(dateFrom, dateTo);

    if (!formattedDate || !formattedSlot || !duration) {
      toast.error("Période ou créneau invalide.");
      return;
    }

    setSaving(true);
    try {
      await updateScheduling({
        orderId,
        desiredDate: formattedDate,
        duration,
        slot: formattedSlot,
      });
      toast.success("Période et créneau enregistrés.");
      onSaved?.();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Impossible d'enregistrer la période."
      );
    } finally {
      setSaving(false);
    }
  };

  if (readOnly) {
    return null;
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-400/25 text-amber-800">
          <Calendar className="size-5" />
        </div>
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <p className="text-sm font-semibold text-amber-950">
              Période à confirmer avec le client
            </p>
            <p className="mt-1 text-sm text-amber-900/80">
              La date et le créneau n&apos;ont pas été transmis par S2MBO.
              Convenez-les avec le client puis complétez-les ici avant de
              confirmer la prestation.
            </p>
          </div>

          <div>
            <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Calendar className="size-3.5" />
              Période confirmée *
            </Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <FrenchDatePicker
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="Date de début"
              />
              <FrenchDatePicker
                value={dateTo}
                min={dateFrom || undefined}
                onChange={setDateTo}
                placeholder="Date de fin"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <Clock className="size-3.5" />
              Créneau horaire *
            </Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <span className="w-8 shrink-0 text-sm text-muted-foreground">
                  De
                </span>
                <FrenchTimePicker
                  value={timeFrom}
                  onChange={setTimeFrom}
                  className="flex-1"
                />
              </div>
              <div className="flex flex-1 items-center gap-3">
                <span className="w-8 shrink-0 text-sm text-muted-foreground">
                  à
                </span>
                <FrenchTimePicker
                  value={timeTo}
                  min={timeFrom || undefined}
                  onChange={setTimeTo}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button
            type="button"
            className="rounded-lg"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              "Enregistrer la période"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
