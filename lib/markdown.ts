import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true,
});

/** Strip dangerous tags/attrs from generated HTML. */
export function sanitizeHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/\son\w+\s*=\s*(['"])[\s\S]*?\1/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}

/** Convert markdown body to sanitized HTML. Drops a leading H1 that duplicates the title. */
export function markdownToHtml(markdown: string, title?: string) {
  let source = markdown.trim();
  if (title) {
    const escaped = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    source = source.replace(
      new RegExp(`^#\\s+${escaped}\\s*\\n+`, "i"),
      ""
    );
  }
  // Drop any first-line H1 so the page template owns the only H1.
  source = source.replace(/^#\s+.+\n+/, "");

  const raw = marked.parse(source, { async: false }) as string;
  return sanitizeHtml(raw);
}

export function estimateReadTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}
