"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Phone, MapPin, Calendar, Eye } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Button } from "@/components/ui/button";

const ALL = "all";

export function AdminCustomersPage() {
  const { canQueryAdmin } = useAdminSession();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const customers = useQuery(
    api.customers.list,
    canQueryAdmin
      ? {
          search: search.trim() || undefined,
          city: city === ALL ? undefined : city,
          status:
            status === ALL
              ? undefined
              : (status as "actif" | "vip" | "inactif"),
        }
      : "skip"
  );

  const cities = useMemo(() => {
    if (!customers) {
      return [];
    }
    return [...new Set(customers.map((customer) => customer.city))].sort((a, b) =>
      a.localeCompare(b, "fr")
    );
  }, [customers]);

  const isLoading = customers === undefined;

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Clients"
        description={
          isLoading
            ? "Chargement…"
            : `${customers.length} client${customers.length > 1 ? "s" : ""} référencé${customers.length > 1 ? "s" : ""}`
        }
      />

      <Card className="border-0 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Recherche
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, téléphone, ville…"
                className="h-10 bg-white pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Ville</label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="h-10 w-full lg:w-[180px]">
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Toutes les villes</SelectItem>
                {cities.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Statut</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-10 w-full lg:w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tous les statuts</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-0 bg-white p-0 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
          <h2 className="text-base font-semibold">Liste des clients</h2>
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Chargement…"
              : `${customers?.length ?? 0} résultat${(customers?.length ?? 0) > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead className="bg-muted/30">
              <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3">Nom</th>
                <th className="px-3 py-3">Téléphone</th>
                <th className="px-3 py-3">Ville / Quartier</th>
                <th className="px-3 py-3 text-center">Commandes</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Statut</th>
                <th className="px-3 py-3">Dernière demande</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    Chargement des clients…
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    Aucun client pour l&apos;instant. Les demandes du site et du CRM
                    apparaîtront ici.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-t border-border/60 transition-colors hover:bg-muted/20"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/customers/${customer._id}`}
                        className="flex items-center gap-3 transition-colors hover:text-brand"
                      >
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-xs font-bold text-brand-deep">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground">{customer.name}</span>
                      </Link>
                    </td>
                    <td className="px-3 py-4">
                      <p className="inline-flex items-center gap-1.5 text-sm text-foreground">
                        <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                        {customer.phone}
                      </p>
                    </td>
                    <td className="px-3 py-4">
                      <div className="min-w-[120px] space-y-0.5">
                        <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                          <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
                          {customer.city}
                        </p>
                        {customer.district ? (
                          <p className="pl-5 text-xs text-muted-foreground">
                            {customer.district}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="font-semibold tabular-nums">{customer.ordersCount}</span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-sm text-muted-foreground">{customer.source}</span>
                    </td>
                    <td className="px-3 py-4">
                      {customer.status === "vip" ? (
                        <Tag tone="brand">VIP</Tag>
                      ) : customer.status === "actif" ? (
                        <Tag tone="success">Actif</Tag>
                      ) : (
                        <Tag tone="neutral">Inactif</Tag>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        {customer.lastOrderLabel}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button asChild size="sm" variant="outline" className="h-8 rounded-lg px-3">
                        <Link href={`/admin/customers/${customer._id}`}>
                          <Eye className="size-3.5" />
                          Voir
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
