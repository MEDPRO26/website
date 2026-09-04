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

/**
 * Remove H1 tags from article HTML so the page template owns the only H1.
 * Also demotes accidental leftover setext/markdown H1s already rendered as h1.
 */
export function stripBodyH1(html: string) {
  return html
    .replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/gi, "")
    .replace(/^\s+/, "");
}

/** Drop markdown ATX H1 lines (# ...) anywhere in the source. */
function stripMarkdownH1(source: string) {
  return source
    .replace(/^\s*#\s+.+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Convert markdown body to sanitized HTML. Page template owns the only H1. */
export function markdownToHtml(markdown: string, _title?: string) {
  const source = stripMarkdownH1(markdown.trim());
  const raw = marked.parse(source, { async: false }) as string;
  return stripBodyH1(sanitizeHtml(raw));
}

/** Extract FAQ pairs from article HTML when Nexus embeds them as H2/H3/P. */
export function extractFaqsFromHtml(html: string) {
  const faqs: { question: string; answer: string }[] = [];
  const faqHeading =
    /<h2\b[^>]*>\s*Questions?\s+fr[eé]quentes[\s\S]*?<\/h2>/i;
  const match = faqHeading.exec(html);
  if (!match || match.index == null) return faqs;

  const after = html.slice(match.index + match[0].length);
  const untilNextH2 = after.split(/<h2\b/i)[0] ?? after;
  const pairs = [
    ...untilNextH2.matchAll(
      /<h3\b[^>]*>([\s\S]*?)<\/h3>\s*<p\b[^>]*>([\s\S]*?)<\/p>/gi
    ),
  ];

  for (const pair of pairs) {
    const question = pair[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const answer = pair[2]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (question && answer) faqs.push({ question, answer });
  }
  return faqs;
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
