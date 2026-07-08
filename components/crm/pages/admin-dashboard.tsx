"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { useAdminSession } from "@/hooks/use-admin-session";
import {
  Inbox,
  Tag as TagIcon,
  Send,
  CheckCircle2,
  PackageCheck,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { mapConvexOrderToUi } from "@/lib/crm/map-convex-order";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";

const CHART_COLORS = [
  "var(--brand)",
  "var(--info)",
  "#7c3aed",
  "#f59e0b",
  "#10b981",
  "#ef4444",
];

export function AdminDashboardPage() {
  const { canQueryAdmin } = useAdminSession();
  const stats = useQuery(
    api.orders.dashboardStats,
    canQueryAdmin ? {} : "skip"
  );
  const analytics = useQuery(
    api.orders.dashboardAnalytics,
    canQueryAdmin ? {} : "skip"
  );
  const commissionStats = useQuery(
    api.commissions.stats,
    canQueryAdmin ? {} : "skip"
  );
  const recentOrders = useQuery(api.orders.list, canQueryAdmin ? {} : "skip");

  const orders7d = analytics?.orders7d ?? [];
  const bySource = analytics?.bySource ?? [];
  const byCity = analytics?.byCity ?? [];
  const byType = analytics?.byType ?? [];
  const suppliersToFollowUp = analytics?.suppliersToFollowUp ?? [];

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité du jour."
        actions={
          <Button asChild className="rounded-xl">
            <Link href="/admin/orders/new">+ Nouvelle commande</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-5">
        <StatCard
          label="Nouvelle demande"
          value={stats?.nouvelle ?? "—"}
          icon={Inbox}
          tone="brand"
          hint="À qualifier ou affecter"
        />
        <StatCard
          label="Total commandes"
          value={stats?.total ?? "—"}
          icon={TagIcon}
          tone="info"
        />
        <StatCard
          label="Offres envoyées"
          value={stats?.offersSent ?? "—"}
          icon={Send}
          tone="brand"
          hint="Offre transmise au client"
        />
        <StatCard
          label="Commandes confirmées"
          value={stats?.confirmed ?? "—"}
          icon={CheckCircle2}
          tone="success"
          hint="Prix accepté, en cours"
        />
        <StatCard
          label="Commandes livrées"
          value={stats?.delivered ?? "—"}
          icon={PackageCheck}
          tone="success"
          hint="Livraison confirmée"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Évolution des commandes (7 jours)</h3>
            <span className="text-xs text-muted-foreground">
              Total : {analytics?.chartTotal7d ?? "—"}
            </span>
          </div>
          <div className="h-56">
            {orders7d.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Pas encore de données.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orders7d}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Area type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes par source</h3>
          <div className="h-56">
            {bySource.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Pas encore de données.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={bySource} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                    {bySource.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes par ville</h3>
          <div className="h-52">
            {byCity.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Pas encore de données.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byCity} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <YAxis dataKey="city" type="category" tickLine={false} axisLine={false} fontSize={12} width={80} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Bar dataKey="count" fill="var(--brand)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes par type de service</h3>
          <div className="h-52">
            {byType.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Pas encore de données.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={0} angle={-15} textAnchor="end" height={50} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                  <Bar dataKey="value" fill="var(--info)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Dernières commandes</h3>
            <Button variant="link" size="sm" asChild>
              <Link href="/admin/orders">Voir tout</Link>
            </Button>
          </div>
          <div className="-mx-5 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="px-5 py-2 font-medium">Référence</th>
                  <th className="py-2 font-medium">Client</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Statut</th>
                  <th className="px-5 py-2 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {(recentOrders ?? []).slice(0, 6).map((order) => {
                  const o = mapConvexOrderToUi(order);
                  return (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-2.5 font-mono text-xs">
                      <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline">
                        {o.ref}
                      </Link>
                    </td>
                    <td className="py-2.5">{o.client}</td>
                    <td className="py-2.5 text-muted-foreground">{o.type}</td>
                    <td className="py-2.5"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-2.5 text-right text-xs text-muted-foreground">{o.createdAt}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Fournisseurs à relancer</h3>
            {suppliersToFollowUp.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucun fournisseur en attente de réponse.
              </p>
            ) : (
              <ul className="space-y-3">
                {suppliersToFollowUp.map((supplier) => (
                  supplier ? (
                  <li key={supplier.id} className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand-deep text-xs font-semibold">
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{supplier.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {supplier.type} · {supplier.city} · {supplier.pending} en attente
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/suppliers/${supplier.id}`}>Voir</Link>
                    </Button>
                  </li>
                  ) : null
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Wallet className="size-4 text-brand" /> Commissions
            </h3>
            <p className="text-2xl font-semibold">
              {(commissionStats?.totalCommission ?? 0).toLocaleString("fr-FR")}{" "}
              <span className="text-sm font-normal text-muted-foreground">MAD</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {commissionStats?.quoteCount ?? 0} devis confirmé
              {(commissionStats?.quoteCount ?? 0) > 1 ? "s" : ""}
              {(commissionStats?.pendingCommission ?? 0) > 0
                ? ` · ${commissionStats!.pendingCommission.toLocaleString("fr-FR")} MAD en attente d'offre`
                : ""}
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link href="/admin/commissions">Voir le détail</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
