"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CMS_PAGES } from "@/lib/mock-data";
import { Plus, FileText, Image as ImageIcon, MapPin } from "lucide-react";

export function AdminCmsPage() {
  return (
    <div>
      <PageHeader title="CMS Site public" description="Contenus de sossante.ma : pages, services, matériel, villes, FAQ, blog." actions={<Button><Plus className="size-4" /> Nouvelle page</Button>} />

      <Tabs defaultValue="pages">
        <TabsList>
          <TabsTrigger value="pages"><FileText className="size-4" /> Pages</TabsTrigger>
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="media"><ImageIcon className="size-4" /> Médias</TabsTrigger>
          <TabsTrigger value="cities"><MapPin className="size-4" /> Villes</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-4">
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">Titre</th>
                    <th className="py-2.5 font-medium">Slug</th>
                    <th className="py-2.5 font-medium">Type</th>
                    <th className="py-2.5 font-medium">Statut</th>
                    <th className="py-2.5 font-medium">Indexable</th>
                    <th className="px-4 py-2.5 font-medium">Modifié</th>
                  </tr>
                </thead>
                <tbody>
                  {CMS_PAGES.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{p.title}</td>
                      <td className="py-3 font-mono text-xs text-muted-foreground">{p.slug}</td>
                      <td className="py-3"><Tag tone="neutral">{p.type}</Tag></td>
                      <td className="py-3"><Tag tone={p.status === "Publié" ? "success" : "warning"}>{p.status}</Tag></td>
                      <td className="py-3">{p.indexable ? <Tag tone="success">Oui</Tag> : <Tag tone="neutral">Non</Tag>}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="p-5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label className="mb-1.5 block">Titre</Label><Input defaultValue="Location matériel médical à Agadir" /></div>
                <div><Label className="mb-1.5 block">Slug</Label><Input defaultValue="/services/location-materiel" /></div>
              </div>
              <div><Label className="mb-1.5 block">H1</Label><Input defaultValue="Location de matériel médical à domicile à Agadir" /></div>
              <div><Label className="mb-1.5 block">Contenu</Label>
                <Textarea rows={10} defaultValue="SOS Santé Agadir vous accompagne pour la location de lits médicalisés, fauteuils roulants, concentrateurs d'oxygène et autres équipements à domicile…" />
              </div>
            </Card>
            <Card className="p-5 space-y-3 h-fit">
              <h3 className="text-sm font-semibold">SEO & publication</h3>
              <div><Label className="mb-1.5 block">Meta title</Label><Input defaultValue="Location matériel médical Agadir — SOS Santé" /></div>
              <div><Label className="mb-1.5 block">Meta description</Label><Textarea rows={3} defaultValue="Location de lits médicalisés et matériel médical à domicile à Agadir, Inezgane et Dcheira. Livraison rapide." /></div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm">Indexable</span><Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm">Publié</span><Switch defaultChecked />
              </div>
              <Button className="w-full">Enregistrer</Button>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="media" className="mt-4">
          <Card className="p-5"><p className="text-sm text-muted-foreground">Bibliothèque médias (mockée).</p></Card>
        </TabsContent>
        <TabsContent value="cities" className="mt-4">
          <Card className="p-5"><p className="text-sm text-muted-foreground">Pages villes : Agadir, Inezgane, Dcheira, Aourir, Taghazout…</p></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}