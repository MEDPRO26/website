"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { format, subDays } from "date-fns";
import { Clock3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FrenchDatePicker } from "@/components/ui/french-date-picker";
import { api } from "@/convex/_generated/api";

function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

export function PeakHoursChart({ enabled }: { enabled: boolean }) {
  const [startDate, setStartDate] = useState(() =>
    format(subDays(new Date(), 29), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(todayIso);

  const data = useQuery(
    api.statistics.peakHours,
    enabled ? { startDate, endDate } : "skip"
  );

  const chartData = useMemo(() => data?.buckets ?? [], [data]);
  const hasData = chartData.some((row) => row.visitors > 0);

  const applyPreset = (days: number) => {
    setStartDate(format(subDays(new Date(), days - 1), "yyyy-MM-dd"));
    setEndDate(todayIso());
  };

  return (
    <Card className="mb-6 p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Clock3 className="size-4 text-brand" />
            Heures de pointe
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Visiteurs par créneau horaire (heure Maroc).
            {data?.peakVisitors ? (
              <>
                {" "}
                · Pic : {data.peakVisitors.label} (
                {data.peakVisitors.visitors})
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(7)}>
            7 jours
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(30)}>
            30 jours
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyPreset(90)}>
            90 jours
          </Button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Du</label>
          <FrenchDatePicker value={startDate} onChange={setStartDate} max={endDate} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Au</label>
          <FrenchDatePicker value={endDate} onChange={setEndDate} min={startDate} />
        </div>
      </div>

      <div className="h-72">
        {data === undefined ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chargement du graphique…
          </p>
        ) : !hasData ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Pas encore de données sur cette période.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                interval={1}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                allowDecimals={false}
                width={32}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }}
                formatter={(value) => [value, "Visiteurs"]}
              />
              <Bar
                dataKey="visitors"
                name="Visiteurs"
                fill="var(--brand)"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
