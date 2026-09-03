"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { categoryLabel } from "@/lib/blog-categories";
import { PUBLIC_SITE_ORIGIN } from "@/lib/hosts";
import { useAdminSession } from "@/hooks/use-admin-session";

export function AdminBlogPage() {
  const { canQueryAdmin, can } = useAdminSession();
  const canManage = can("cms.manage_blog");
  const articles = useQuery(
    api.blogArticles.listForAdmin,
    canQueryAdmin && canManage ? {} : "skip"
  );
  const setStatus = useMutation(api.blogArticles.setStatus);
  const remove = useMutation(api.blogArticles.remove);

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? PUBLIC_SITE_ORIGIN
  ).replace(/\/$/, "");

  if (!canManage) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Blog"
          description="Permission cms.manage_blog requise."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog"
        description="Articles importés depuis SEO Nexus. Les brouillons ne sont pas visibles sur le site public."
      />

      {!articles ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Chargement…
        </div>
      ) : articles.length === 0 ? (
        <Card className="p-6 text-sm text-muted-foreground">
          Aucun article importé pour le moment. L&apos;endpoint{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            POST /api/articles/import
          </code>{" "}
          est prêt à recevoir les articles de SEO Nexus.
        </Card>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => {
            const publicUrl = `${siteUrl}/blog/${article.slug}`;
            return (
              <Card key={article._id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag
                        tone={
                          article.status === "published" ? "success" : "neutral"
                        }
                      >
                        {article.status === "published"
                          ? "Publié"
                          : "Brouillon"}
                      </Tag>
                      {article.categories[0] ? (
                        <span className="text-xs text-muted-foreground">
                          {categoryLabel(article.categories[0])}
                        </span>
                      ) : null}
                      <span className="text-xs text-muted-foreground">
                        {new Date(article.updatedAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold leading-snug">
                      {article.title}
                    </h2>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {article.excerpt || "Sans extrait"}
                    </p>
                    <p className="truncate font-mono text-xs text-muted-foreground">
                      /blog/{article.slug}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.status === "published" ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={publicUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3.5" />
                          Voir
                        </Link>
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          await setStatus({
                            id: article._id,
                            status:
                              article.status === "published"
                                ? "draft"
                                : "published",
                          });
                          toast.success(
                            article.status === "published"
                              ? "Remis en brouillon"
                              : "Article publié"
                          );
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Échec de la mise à jour"
                          );
                        }
                      }}
                    >
                      {article.status === "published"
                        ? "Dépublier"
                        : "Publier"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Supprimer définitivement « ${article.title} » ?`
                          )
                        ) {
                          return;
                        }
                        try {
                          await remove({
                            id: article._id as Id<"blogArticles">,
                          });
                          toast.success("Article supprimé");
                        } catch (error) {
                          toast.error(
                            error instanceof Error
                              ? error.message
                              : "Échec de la suppression"
                          );
                        }
                      }}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
