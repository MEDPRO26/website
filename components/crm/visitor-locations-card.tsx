"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { format, subDays } from "date-fns";
import { MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FrenchDatePicker } from "@/components/ui/french-date-picker";
import { api } from "@/convex/_generated/api";

function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

export function VisitorLocationsCard({ enabled }: { enabled: boolean }) {
  const [startDate, setStartDate] = useState(() =>
    format(subDays(new Date(), 29), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(todayIso);

  useEffect(() => {
    setEndDate(todayIso());
  }, []);

  const locations = useQuery(
    api.statistics.visitorLocations,
    enabled ? { startDate, endDate } : "skip"
  );

  return (
    <Card className="mb-6 p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="size-4 text-brand" />
            Origine des visiteurs
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Localisation approximative via adresse IP (ville et pays).
            {locations ? (
              <>
                {" "}
                · Maroc : {locations.totals.morocco} · International :{" "}
                {locations.totals.abroad}
                {locations.totals.unknown > 0
                  ? ` · Inconnu : ${locations.totals.unknown}`
                  : ""}
              </>
            ) : null}
          </p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[28rem]">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Du</label>
            <FrenchDatePicker value={startDate} onChange={setStartDate} max={endDate} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Au</label>
            <FrenchDatePicker value={endDate} onChange={setEndDate} min={startDate} />
          </div>
        </div>
      </div>

      {locations === undefined ? (
        <p className="text-sm text-muted-foreground">Chargement des localisations…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border/60 p-4">
            <h3 className="mb-3 text-sm font-semibold">Maroc par ville</h3>
            {locations.moroccoCities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune visite localisée au Maroc sur cette période.
              </p>
            ) : (
              <div className="space-y-2">
                {locations.moroccoCities.map((row) => (
                  <div
                    key={row.city}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium">{row.city}</span>
                    <span className="text-muted-foreground">
                      {row.visitors} visiteur{row.visitors > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border/60 p-4">
            <h3 className="mb-3 text-sm font-semibold">Hors Maroc</h3>
            {locations.abroad.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune visite internationale localisée sur cette période.
              </p>
            ) : (
              <div className="space-y-2">
                {locations.abroad.map((row) => (
                  <div
                    key={row.location}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="font-medium">{row.location}</span>
                    <span className="text-muted-foreground">
                      {row.visitors} visiteur{row.visitors > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
