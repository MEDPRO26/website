"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USERS } from "@/lib/mock-data";
import { UserPlus } from "lucide-react";

export function AdminUsersPage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <PageHeader
        title="Utilisateurs & rôles"
        description={`${USERS.length} utilisateurs · admin, assistants et fournisseurs`}
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><UserPlus className="size-4" /> Inviter</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inviter un utilisateur</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="mb-1.5 block">Email</Label>
                  <Input placeholder="email@sossante.ma" />
                </div>
                <div>
                  <Label className="mb-1.5 block">Rôle</Label>
                  <Select defaultValue="assistant">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="assistant">Assistant</SelectItem>
                      <SelectItem value="supplier">Fournisseur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1.5 block">Fournisseur lié (si fournisseur)</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="s1">Fournisseur Démo Agadir</SelectItem>
                      <SelectItem value="s2">MedAgadir Pro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={() => setOpen(false)}>Envoyer invitation</Button>
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
                <th className="px-4 py-2.5 font-medium">Nom</th>
                <th className="py-2.5 font-medium">Email</th>
                <th className="py-2.5 font-medium">Rôle</th>
                <th className="py-2.5 font-medium">Statut</th>
                <th className="py-2.5 font-medium">Dernière connexion</th>
                <th className="py-2.5 font-medium">Créé le</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {USERS.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{u.name}</td>
                  <td className="py-3 text-muted-foreground">{u.email}</td>
                  <td className="py-3">
                    <Tag tone={u.role === "Admin" ? "brand" : u.role === "Fournisseur" ? "info" : "neutral"}>{u.role}</Tag>
                  </td>
                  <td className="py-3">
                    <Tag tone={u.status === "Actif" ? "success" : "warning"}>{u.status}</Tag>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground">{u.lastLogin}</td>
                  <td className="py-3 text-xs text-muted-foreground">{u.createdAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline">Modifier</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}