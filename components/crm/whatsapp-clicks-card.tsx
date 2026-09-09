"use client";

import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { format, subDays } from "date-fns";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { FrenchDatePicker } from "@/components/ui/french-date-picker";
import { api } from "@/convex/_generated/api";
import { whatsappPlacementLabel } from "@/lib/whatsapp-tracking";

function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

function cityLabel(slug: string) {
  if (slug === "national") return "Page nationale / hors ville";
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function WhatsappClicksCard({
  enabled,
  recentLimit = 100,
}: {
  enabled: boolean;
  recentLimit?: number;
}) {
  const [startDate, setStartDate] = useState(() =>
    format(subDays(new Date(), 29), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(todayIso);

  useEffect(() => {
    setEndDate(todayIso());
  }, []);

  const data = useQuery(
    api.statistics.whatsappClicks,
    enabled ? { startDate, endDate, limit: recentLimit } : "skip"
  );

  return (
    <Card className="mb-6 p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="size-4 text-brand" />
            Clics WhatsApp (site)
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Bouton cliqué, page, ville de la page, et localisation IP
            approximative.
            {data ? (
              <>
                {" "}
                · Total : {data.total}
                {data.totals.morocco > 0
                  ? ` · Maroc IP : ${data.totals.morocco}`
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

      {data === undefined ? (
        <p className="text-sm text-muted-foreground">Chargement des clics WhatsApp…</p>
      ) : data.total === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucun clic WhatsApp enregistré sur cette période.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border/60 p-4">
              <h3 className="mb-3 text-sm font-semibold">Par bouton</h3>
              <div className="space-y-2">
                {data.byPlacement.map((row) => (
                  <div
                    key={row.placement}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="truncate text-muted-foreground">
                      {whatsappPlacementLabel(row.placement)}
                    </span>
                    <span className="font-semibold tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-4">
              <h3 className="mb-3 text-sm font-semibold">Ville de la page</h3>
              <div className="space-y-2">
                {data.byPageCity.map((row) => (
                  <div
                    key={row.city}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="truncate text-muted-foreground">
                      {cityLabel(row.city)}
                    </span>
                    <span className="font-semibold tabular-nums">{row.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 p-4">
              <h3 className="mb-3 text-sm font-semibold">Ville IP (Maroc)</h3>
              {data.moroccoCities.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune localisation Maroc détectée.
                </p>
              ) : (
                <div className="space-y-2">
                  {data.moroccoCities.map((row) => (
                    <div
                      key={row.city}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="truncate text-muted-foreground">{row.city}</span>
                      <span className="font-semibold tabular-nums">{row.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/60">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Quand</th>
                  <th className="px-3 py-2 font-medium">Bouton</th>
                  <th className="px-3 py-2 font-medium">Page</th>
                  <th className="px-3 py-2 font-medium">Ville page</th>
                  <th className="px-3 py-2 font-medium">Localisation IP</th>
                </tr>
              </thead>
              <tbody>
                {data.recent.map((row) => (
                  <tr key={row.id} className="border-b border-border/40 last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="font-medium">{row.clickedLabel}</div>
                      <div className="text-xs text-muted-foreground">
                        {format(row.clickedAt, "dd/MM/yyyy HH:mm")}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div>{whatsappPlacementLabel(row.placement)}</div>
                      {row.label ? (
                        <div className="text-xs text-muted-foreground">{row.label}</div>
                      ) : null}
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-2 font-mono text-xs">
                      {row.path}
                    </td>
                    <td className="px-3 py-2 capitalize">
                      {row.pageCitySlug ?? "—"}
                    </td>
                    <td className="px-3 py-2">
                      <div>{row.location}</div>
                      <div className="text-xs text-muted-foreground">{row.deviceLabel}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.total > data.recent.length ? (
              <p className="border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">
                Affichage des {data.recent.length} clics les plus récents sur {data.total}.
              </p>
            ) : null}
          </div>
        </div>
      )}
    </Card>
  );
}
