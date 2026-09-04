"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tag } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  categoryLabel,
  blogPostPath,
  resolveCategorySlug,
} from "@/lib/blog-categories";
import { PUBLIC_SITE_ORIGIN } from "@/lib/hosts";
import { useAdminSession } from "@/hooks/use-admin-session";

function toDatetimeLocalValue(ms: number | undefined) {
  const date = new Date(ms ?? Date.now());
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatPublishLabel(ms: number | undefined) {
  if (ms == null) return "Non définie";
  return new Date(ms).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function PublishScheduleField({
  articleId,
  publishedAt,
  status,
}: {
  articleId: Id<"blogArticles">;
  publishedAt?: number;
  status: "draft" | "published";
}) {
  const setPublishedAt = useMutation(api.blogArticles.setPublishedAt);
  const [value, setValue] = useState(() => toDatetimeLocalValue(publishedAt));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(toDatetimeLocalValue(publishedAt));
  }, [publishedAt, articleId]);

  const save = async () => {
    const ms = new Date(value).getTime();
    if (!Number.isFinite(ms)) {
      toast.error("Date ou heure invalide");
      return;
    }
    if (publishedAt != null && ms === publishedAt) return;
    setSaving(true);
    try {
      await setPublishedAt({ id: articleId, publishedAt: ms });
      toast.success(
        ms > Date.now()
          ? "Publication programmée"
          : "Date de publication enregistrée"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Échec de l’enregistrement"
      );
      setValue(toDatetimeLocalValue(publishedAt));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={`publish-at-${articleId}`}
        className="text-xs text-muted-foreground"
      >
        Date et heure de publication
      </Label>
      <div className="flex flex-wrap items-center gap-2">
        <Input
          id={`publish-at-${articleId}`}
          type="datetime-local"
          className="h-8 w-[11.5rem]"
          value={value}
          disabled={saving}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => void save()}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.currentTarget.blur();
            }
          }}
        />
        {saving ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {status === "published" && (publishedAt ?? 0) > Date.now()
              ? "Programmé (invisible jusqu’à cette heure)"
              : `Affiché : ${formatPublishLabel(publishedAt)}`}
          </span>
        )}
      </div>
    </div>
  );
}

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
        description="Articles importés depuis SEO Nexus. Les brouillons et publications futures ne sont pas visibles sur le site public."
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
            const categorySlug = resolveCategorySlug(article.categories[0]);
            const path = blogPostPath(categorySlug, article.slug);
            const publicUrl = `${siteUrl}${path}`;
            const isScheduled =
              article.status === "published" &&
              (article.publishedAt ?? 0) > Date.now();
            const isLive =
              article.status === "published" &&
              (article.publishedAt == null ||
                article.publishedAt <= Date.now());

            return (
              <Card key={article._id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag
                          tone={
                            isLive
                              ? "success"
                              : isScheduled
                                ? "warning"
                                : "neutral"
                          }
                        >
                          {isLive
                            ? "Publié"
                            : isScheduled
                              ? "Programmé"
                              : "Brouillon"}
                        </Tag>
                        {article.categories[0] ? (
                          <span className="text-xs text-muted-foreground">
                            {categoryLabel(categorySlug)}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="text-base font-semibold leading-snug">
                        {article.title}
                      </h2>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {article.excerpt || "Sans extrait"}
                      </p>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {path}
                      </p>
                    </div>
                    <PublishScheduleField
                      articleId={article._id}
                      publishedAt={article.publishedAt}
                      status={article.status}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isLive ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={publicUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
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
                          if (article.status === "published") {
                            await setStatus({
                              id: article._id,
                              status: "draft",
                            });
                            toast.success("Remis en brouillon");
                            return;
                          }
                          const input = document.getElementById(
                            `publish-at-${article._id}`
                          ) as HTMLInputElement | null;
                          const ms = input?.value
                            ? new Date(input.value).getTime()
                            : (article.publishedAt ?? Date.now());
                          await setStatus({
                            id: article._id,
                            status: "published",
                            publishedAt: Number.isFinite(ms) ? ms : Date.now(),
                          });
                          toast.success(
                            ms > Date.now()
                              ? "Article programmé"
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
