"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { format, subDays, subMonths } from "date-fns";
import { Globe } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";

type Granularity = "day" | "month" | "year";

function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

function defaultRange(granularity: Granularity) {
  const today = todayIso();
  if (granularity === "year") {
    const year = Number(today.slice(0, 4));
    return {
      startDate: `${year - 4}-01-01`,
      endDate: today,
    };
  }
  if (granularity === "month") {
    return {
      startDate: format(subMonths(new Date(), 11), "yyyy-MM-dd").slice(0, 7) + "-01",
      endDate: today,
    };
  }
  return {
    startDate: format(subDays(new Date(), 29), "yyyy-MM-dd"),
    endDate: today,
  };
}

export function VisitorHistoryChart({ enabled }: { enabled: boolean }) {
  const [granularity, setGranularity] = useState<Granularity>("month");
  const [startDate, setStartDate] = useState(() => defaultRange("month").startDate);
  const [endDate, setEndDate] = useState(() => defaultRange("month").endDate);

  useEffect(() => {
    const range = defaultRange(granularity);
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  }, [granularity]);

  const history = useQuery(
    api.statistics.visitorHistory,
    enabled
      ? {
          startDate,
          endDate,
          granularity,
        }
      : "skip"
  );

  const chartData = useMemo(() => history?.points ?? [], [history]);

  const applyPreset = (preset: "30d" | "12m" | "5y") => {
    const today = todayIso();
    if (preset === "30d") {
      setGranularity("day");
      setStartDate(format(subDays(new Date(), 29), "yyyy-MM-dd"));
      setEndDate(today);
      return;
    }
    if (preset === "12m") {
      setGranularity("month");
      setStartDate(format(subMonths(new Date(), 11), "yyyy-MM-dd").slice(0, 7) + "-01");
      setEndDate(today);
      return;
    }
    const year = Number(today.slice(0, 4));
    setGranularity("year");
    setStartDate(`${year - 4}-01-01`);
    setEndDate(today);
  };

  return (
    <Card className="mb-6 p-5">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Globe className="size-4 text-brand" />
            Visiteurs uniques
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Comparaison par jour, mois ou année sur le site public.
            {history ? (
              <>
                {" "}
                · Total période :{" "}
                <span className="font-medium text-foreground">
                  {history.totalUniqueVisitors.toLocaleString("fr-FR")}
                </span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => applyPreset("30d")}>
            30 jours
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyPreset("12m")}>
            12 mois
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyPreset("5y")}>
            5 ans
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
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Regrouper par</label>
          <Select
            value={granularity}
            onValueChange={(value) => setGranularity(value as Granularity)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Jour</SelectItem>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-64">
        {history === undefined ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chargement du graphique…
          </p>
        ) : chartData.length === 0 || chartData.every((point) => point.visitors === 0) ? (
          <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Pas encore de visiteurs enregistrés sur cette période.
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
                interval="preserveStartEnd"
                minTickGap={24}
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
                formatter={(value) => [value, "Visiteurs uniques"]}
                labelFormatter={(label) => String(label)}
              />
              <Bar
                dataKey="visitors"
                fill="var(--brand)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
