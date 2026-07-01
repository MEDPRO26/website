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
import { Search } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";

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

  return (
    <div>
      <PageHeader
        title="Clients"
        description={
          customers === undefined
            ? "Chargement…"
            : `${customers.length} client${customers.length > 1 ? "s" : ""} référencé${customers.length > 1 ? "s" : ""}`
        }
      />

      <Card className="mb-4 p-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, téléphone, ville…"
              className="h-9 pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-9 w-full sm:w-40">
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
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-full sm:w-36">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Tous</SelectItem>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Nom</th>
                <th className="py-2.5 font-medium">Téléphone</th>
                <th className="py-2.5 font-medium">Ville / Quartier</th>
                <th className="py-2.5 font-medium text-center">Commandes</th>
                <th className="py-2.5 font-medium">Source</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="px-4 py-2.5 font-medium">Dernière demande</th>
              </tr>
            </thead>
            <tbody>
              {customers === undefined ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Chargement des clients…
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun client pour l&apos;instant. Les demandes du site et du CRM
                    apparaîtront ici.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-t border-border hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/customers/${customer._id}`}
                        className="flex items-center gap-2 hover:text-brand"
                      >
                        <div className="grid size-8 place-items-center rounded-full bg-brand-soft text-brand-deep text-xs font-semibold">
                          {customer.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <span className="font-medium">{customer.name}</span>
                      </Link>
                    </td>
                    <td className="py-3 text-xs">{customer.phone}</td>
                    <td className="py-3">
                      <div>{customer.city}</div>
                      <div className="text-xs text-muted-foreground">
                        {customer.district ?? "—"}
                      </div>
                    </td>
                    <td className="py-3 text-center font-medium">
                      {customer.ordersCount}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {customer.source}
                    </td>
                    <td className="py-3">
                      {customer.status === "vip" ? (
                        <Tag tone="brand">VIP</Tag>
                      ) : customer.status === "actif" ? (
                        <Tag tone="success">Actif</Tag>
                      ) : (
                        <Tag tone="neutral">Inactif</Tag>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {customer.lastOrderLabel}
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
