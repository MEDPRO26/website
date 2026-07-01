"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { ClipboardList, Search, Truck, Users } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useAdminSession } from "@/hooks/use-admin-session";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function GlobalSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { canQueryAdmin } = useAdminSession();
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useQuery(
    api.crmSearch.global,
    canQueryAdmin && debounced.length >= 2 ? { q: debounced } : "skip"
  );

  const hasResults =
    results !== undefined &&
    (results.orders.length > 0 ||
      results.customers.length > 0 ||
      results.suppliers.length > 0);

  const showPanel = open && debounced.length >= 2;

  return (
    <div className={cn("relative min-w-0 flex-1 max-w-xl", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Rechercher une commande, un client, un fournisseur…"
        className="h-10 w-full pl-10 bg-muted/50 border-transparent focus-visible:bg-card"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
          }
          if (e.key === "Enter" && results?.orders[0]) {
            router.push(`/admin/orders/${results.orders[0]._id}`);
            setOpen(false);
          }
        }}
      />

      {showPanel ? (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[min(70vh,420px)] overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {!results ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">Recherche…</p>
          ) : !hasResults ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Aucun résultat pour « {debounced} »
            </p>
          ) : (
            <div className="py-2">
              {results.orders.length > 0 ? (
                <section>
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Commandes
                  </p>
                  {results.orders.map((order) => (
                    <Link
                      key={order._id}
                      href={`/admin/orders/${order._id}`}
                      className="flex items-start gap-2 px-3 py-2 hover:bg-muted/60"
                      onClick={() => setOpen(false)}
                    >
                      <ClipboardList className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span>
                        <span className="block text-sm font-medium">{order.ref}</span>
                        <span className="block text-xs text-muted-foreground">
                          {order.clientName} · {order.item}
                        </span>
                      </span>
                    </Link>
                  ))}
                </section>
              ) : null}

              {results.customers.length > 0 ? (
                <section>
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Clients
                  </p>
                  {results.customers.map((customer) => (
                    <Link
                      key={customer._id}
                      href={`/admin/customers/${customer._id}`}
                      className="flex items-start gap-2 px-3 py-2 hover:bg-muted/60"
                      onClick={() => setOpen(false)}
                    >
                      <Users className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span>
                        <span className="block text-sm font-medium">{customer.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {customer.phone} · {customer.city}
                        </span>
                      </span>
                    </Link>
                  ))}
                </section>
              ) : null}

              {results.suppliers.length > 0 ? (
                <section>
                  <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Fournisseurs
                  </p>
                  {results.suppliers.map((supplier) => (
                    <Link
                      key={supplier._id}
                      href={`/admin/suppliers/${supplier._id}`}
                      className="flex items-start gap-2 px-3 py-2 hover:bg-muted/60"
                      onClick={() => setOpen(false)}
                    >
                      <Truck className="mt-0.5 size-4 shrink-0 text-brand" />
                      <span>
                        <span className="block text-sm font-medium">{supplier.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {supplier.city} · {supplier.status}
                        </span>
                      </span>
                    </Link>
                  ))}
                </section>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
