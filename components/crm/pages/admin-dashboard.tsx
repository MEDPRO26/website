"use client";

import Link from "next/link";
import {
  Inbox, UserCheck, Clock, Tag as TagIcon, Send, CheckCircle2,
  CalendarClock, AlertTriangle, Wallet,
} from "lucide-react";
import { PageHeader, DemoBanner } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ORDERS, KPI, CHART_ORDERS_7D, CHART_BY_SOURCE, CHART_BY_CITY, CHART_BY_TYPE,
  CHART_COLORS, SUPPLIERS, COMPLAINTS,
} from "@/lib/mock-data";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from "recharts";

export function AdminDashboardPage() {
  return (
    <div>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble de l'activité du jour."
        actions={
          <Button asChild>
            <Link href="/admin/orders/new">+ Nouvelle commande</Link>
          </Button>
        }
      />
      <DemoBanner />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Nouvelles demandes aujourd'hui" value={KPI.newToday} icon={Inbox} tone="brand" hint="+2 vs hier" />
        <StatCard label="Commandes à affecter" value={KPI.toAssign} icon={UserCheck} tone="warning" />
        <StatCard label="En attente fournisseur" value={KPI.waitingSupplier} icon={Clock} tone="info" />
        <StatCard label="Prix reçus" value={KPI.pricesReceived} icon={TagIcon} tone="info" />
        <StatCard label="Offres envoyées" value={KPI.offersSent} icon={Send} tone="brand" />
        <StatCard label="Commandes confirmées" value={KPI.confirmed} icon={CheckCircle2} tone="success" />
        <StatCard label="Locations actives" value={KPI.activeRentals} icon={CalendarClock} tone="success" />
        <StatCard label="Réclamations ouvertes" value={KPI.openComplaints} icon={AlertTriangle} tone="danger" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Évolution des commandes (7 jours)</h3>
            <span className="text-xs text-muted-foreground">Total : 58</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_ORDERS_7D}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="count" stroke="var(--brand)" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes par source</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CHART_BY_SOURCE} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {CHART_BY_SOURCE.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes par ville</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_BY_CITY} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis dataKey="city" type="category" tickLine={false} axisLine={false} fontSize={12} width={80} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Bar dataKey="count" fill="var(--brand)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold">Demandes par type de service</h3>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_BY_TYPE}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={10} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)" }} />
                <Bar dataKey="value" fill="var(--info)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
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
                {ORDERS.slice(0, 6).map((o) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Fournisseurs à relancer</h3>
            <ul className="space-y-3">
              {SUPPLIERS.slice(0, 3).map((s) => (
                <li key={s.id} className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand-deep text-xs font-semibold">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{s.type} · {s.city}</p>
                  </div>
                  <Button size="sm" variant="outline">Relancer</Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Wallet className="size-4 text-brand" /> Commissions dues
            </h3>
            <p className="text-2xl font-semibold">{KPI.dueCommissions.toLocaleString("fr-FR")} <span className="text-sm font-normal text-muted-foreground">MAD</span></p>
            <p className="mt-1 text-xs text-muted-foreground">Sur 3 fournisseurs</p>
            <Button asChild variant="outline" size="sm" className="mt-3 w-full">
              <Link href="/admin/commissions">Voir le détail</Link>
            </Button>
          </Card>

          <Card className="p-5">
            <h3 className="mb-3 text-sm font-semibold">Réclamations récentes</h3>
            <ul className="space-y-2">
              {COMPLAINTS.slice(0, 2).map((c) => (
                <li key={c.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{c.type}</p>
                    <span className="text-[11px] text-muted-foreground">{c.date}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{c.client} · {c.order}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}