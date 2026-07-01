"use client";

import Link from "next/link";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAdminSession } from "@/hooks/use-admin-session";

const STATUS_LABEL: Record<string, string> = {
  ouverte: "Ouverte",
  en_traitement: "En traitement",
  resolue: "Résolue",
};

const PRIORITY_LABEL: Record<string, string> = {
  haute: "Haute",
  moyenne: "Moyenne",
  basse: "Basse",
};

export function AdminComplaintsPage() {
  const { canQueryAdmin } = useAdminSession();
  const complaints = useQuery(api.complaints.list, canQueryAdmin ? {} : "skip");
  const suppliers = useQuery(
    api.suppliers.list,
    canQueryAdmin ? {} : "skip"
  );
  const createComplaint = useMutation(api.complaints.create);
  const updateStatus = useMutation(api.complaints.updateStatus);

  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("moyenne");
  const [supplierId, setSupplierId] = useState("");
  const [notes, setNotes] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<Id<"orders"> | "">("");
  const [submitting, setSubmitting] = useState(false);

  const orderResults = useQuery(
    api.orders.search,
    canQueryAdmin && orderSearch.trim().length >= 2
      ? { q: orderSearch.trim() }
      : "skip"
  );

  const handleCreate = async () => {
    if (!clientName.trim() || !type.trim()) {
      toast.error("Client et type obligatoires.");
      return;
    }
    setSubmitting(true);
    try {
      await createComplaint({
        orderId: selectedOrderId || undefined,
        clientName,
        type,
        priority: priority as "basse" | "moyenne" | "haute",
        supplierId: supplierId ? (supplierId as Id<"suppliers">) : undefined,
        notes: notes.trim() || undefined,
      });
      toast.success("Réclamation créée.");
      setOpen(false);
      setClientName("");
      setType("");
      setNotes("");
      setSupplierId("");
      setOrderSearch("");
      setSelectedOrderId("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Réclamations"
        description="Suivi des réclamations clients et fournisseurs."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>+ Nouvelle réclamation</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle réclamation</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label>Commande liée</Label>
                  <Input
                    className="mt-1.5"
                    placeholder="Rechercher par réf. SOS-AG…"
                    value={orderSearch}
                    onChange={(e) => {
                      setOrderSearch(e.target.value);
                      setSelectedOrderId("");
                    }}
                  />
                  {selectedOrderId ? (
                    <p className="mt-1 text-xs text-success">
                      Commande sélectionnée ·{" "}
                      {orderResults?.find((o) => o._id === selectedOrderId)?.ref}
                    </p>
                  ) : null}
                  {orderResults && orderResults.length > 0 && !selectedOrderId ? (
                    <ul className="mt-2 max-h-32 overflow-y-auto rounded-lg border border-border text-xs">
                      {orderResults.map((order) => (
                        <li key={order._id}>
                          <button
                            type="button"
                            className="flex w-full flex-col px-3 py-2 text-left hover:bg-muted/50"
                            onClick={() => {
                              setSelectedOrderId(order._id);
                              setOrderSearch(order.ref);
                              if (!clientName.trim()) {
                                setClientName(order.clientName);
                              }
                            }}
                          >
                            <span className="font-mono text-brand">{order.ref}</span>
                            <span className="text-muted-foreground">
                              {order.clientName} · {order.item}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div>
                  <Label>Client *</Label>
                  <Input className="mt-1.5" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                </div>
                <div>
                  <Label>Type *</Label>
                  <Input className="mt-1.5" value={type} onChange={(e) => setType(e.target.value)} placeholder="Retard livraison, Facturation…" />
                </div>
                <div>
                  <Label>Priorité</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="haute">Haute</SelectItem>
                      <SelectItem value="moyenne">Moyenne</SelectItem>
                      <SelectItem value="basse">Basse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Fournisseur</Label>
                  <Select value={supplierId || "none"} onValueChange={(v) => setSupplierId(v === "none" ? "" : v)}>
                    <SelectTrigger className="mt-1.5"><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      {(suppliers ?? []).map((s) => (
                        <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea className="mt-1.5" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button disabled={submitting} onClick={() => void handleCreate()}>
                  {submitting ? <Loader2 className="size-4 animate-spin" /> : "Créer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Référence</th>
                <th className="py-2.5 font-medium">Commande</th>
                <th className="py-2.5 font-medium">Client</th>
                <th className="py-2.5 font-medium">Fournisseur</th>
                <th className="py-2.5 font-medium">Type</th>
                <th className="py-2.5 font-medium">Priorité</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium">Responsable</th>
                <th className="px-4 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints === undefined ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">Chargement…</td></tr>
              ) : complaints.length === 0 ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">Aucune réclamation.</td></tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="border-t border-border hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs text-brand">{c.ref}</td>
                    <td className="py-3 font-mono text-xs">
                      {c.orderRef ? (
                        c.orderId ? (
                          <Link
                            href={`/admin/orders/${c.orderId}`}
                            className="text-brand hover:underline"
                          >
                            {c.orderRef}
                          </Link>
                        ) : (
                          c.orderRef
                        )
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3">{c.clientName}</td>
                    <td className="py-3 text-muted-foreground">{c.supplierName ?? "—"}</td>
                    <td className="py-3">{c.type}</td>
                    <td className="py-3">
                      <Tag tone={c.priority === "haute" ? "danger" : c.priority === "moyenne" ? "warning" : "neutral"}>
                        {PRIORITY_LABEL[c.priority]}
                      </Tag>
                    </td>
                    <td className="py-3">
                      <Select
                        value={c.status}
                        onValueChange={(value) =>
                          void updateStatus({
                            id: c._id,
                            status: value as "ouverte" | "en_traitement" | "resolue",
                          })
                        }
                      >
                        <SelectTrigger className="h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ouverte">Ouverte</SelectItem>
                          <SelectItem value="en_traitement">En traitement</SelectItem>
                          <SelectItem value="resolue">Résolue</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3">{c.assigneeName}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.dateLabel}</td>
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
