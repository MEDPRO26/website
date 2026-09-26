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

const FAQ_SECTION_HEADING =
  /<h2\b[^>]*>\s*(?:FAQ\s*[:\-–—.]?\s*)?Questions?\s+fr[eé]quentes[\s\S]*?<\/h2>/i;

/** Also catch standalone "FAQ" / "FAQ :" section titles from Nexus. */
const FAQ_SECTION_HEADING_LOOSE =
  /<h2\b[^>]*>\s*FAQ\b[\s\S]*?<\/h2>/i;

function findFaqSectionHeading(html: string) {
  return FAQ_SECTION_HEADING.exec(html) ?? FAQ_SECTION_HEADING_LOOSE.exec(html);
}

function stripTags(value: string) {
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeFaqText(value: string) {
  return stripTags(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function isQuestionHeading(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return false;
  if (/\?$/.test(normalized)) return true;
  return /^(quel|quelle|quels|quelles|comment|pourquoi|qui|quoi|où|ou|combien|à|a|c['']est)\b/i.test(
    normalized
  );
}

function isFaqSectionTitle(text: string) {
  const normalized = normalizeFaqText(text);
  return (
    normalized === "faq" ||
    normalized.startsWith("faq ") ||
    normalized.startsWith("faq:") ||
    /^questions?\s+frequentes/.test(normalized)
  );
}

/** H2 that ends the FAQ block (CTA / next section), even if it contains "?". */
function isFaqSectionEndHeading(text: string) {
  if (isFaqSectionTitle(text)) return false;
  const normalized = normalizeFaqText(text);
  if (
    /^(conclusion|pour aller plus loin|besoin d|contactez|etapes suivantes|appel a l|liens vers)/.test(
      normalized
    )
  ) {
    return true;
  }
  if (isQuestionHeading(text)) return false;
  return true;
}

/**
 * Extract FAQ pairs from article HTML when Nexus embeds them as H2/H3/P.
 * Supports both:
 * - H2 "Questions fréquentes…" / "FAQ : …" then H3 question + P answer
 * - H2 FAQ title then H2 questions ending with "?" + P answers
 */
export function extractFaqsFromHtml(html: string) {
  const faqs: { question: string; answer: string }[] = [];
  const match = findFaqSectionHeading(html);
  if (!match || match.index == null) return faqs;

  const after = html.slice(match.index + match[0].length);
  const untilNextNonFaq = splitAfterFaqSection(after);
  const section = untilNextNonFaq.section;

  const h3Pairs = [
    ...section.matchAll(
      /<h3\b[^>]*>([^<]+)<\/h3>\s*((?:<p\b[^>]*>[\s\S]*?<\/p>\s*)+)/gi
    ),
  ];
  for (const pair of h3Pairs) {
    const question = stripTags(pair[1] ?? "");
    const answer = stripTags(pair[2] ?? "");
    if (question && answer) faqs.push({ question, answer });
  }

  if (faqs.length > 0) return faqs;

  const h2Pairs = [
    ...section.matchAll(
      /<h2\b[^>]*>([^<]+)<\/h2>\s*((?:<p\b[^>]*>[\s\S]*?<\/p>\s*)+)/gi
    ),
  ];
  for (const pair of h2Pairs) {
    const question = stripTags(pair[1] ?? "");
    if (!isQuestionHeading(question) || isFaqSectionTitle(question)) continue;
    const answer = stripTags(pair[2] ?? "");
    if (question && answer) faqs.push({ question, answer });
  }

  return faqs;
}

/**
 * Remove the FAQ block from article HTML so questions only appear in the FAQ section.
 * Keeps everything before the FAQ heading and any non-FAQ sections after it.
 */
export function stripFaqSectionFromHtml(html: string) {
  const match = findFaqSectionHeading(html);
  if (!match || match.index == null) return html;

  const before = html.slice(0, match.index);
  const after = html.slice(match.index + match[0].length);
  const { rest } = splitAfterFaqSection(after);
  return `${before}${rest}`.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Remove H2/H3 FAQ Q&A blocks that match known structured faqs (Nexus payload),
 * even when they were duplicated under Conclusion or elsewhere in the body.
 */
export function stripKnownFaqsFromHtml(
  html: string,
  faqs: Array<{ question: string; answer?: string }>
) {
  if (!faqs.length) return html;

  const targets = new Set(
    faqs
      .map((faq) => normalizeFaqText(faq.question))
      .filter(Boolean)
  );
  if (targets.size === 0) return html;

  return html
    .replace(
      /<h([23])\b[^>]*>([^<]+)<\/h\1>\s*((?:<p\b[^>]*>[\s\S]*?<\/p>\s*)+)/gi,
      (full, _level: string, headingHtml: string) => {
        const question = normalizeFaqText(headingHtml);
        return targets.has(question) ? "" : full;
      }
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Slice FAQ body until the next non-question H2 (or end). */
function splitAfterFaqSection(afterFaqHeading: string) {
  const headingMatches = [
    ...afterFaqHeading.matchAll(/<h2\b[^>]*>([^<]+)<\/h2>/gi),
  ];

  for (const heading of headingMatches) {
    const text = stripTags(heading[1] ?? "");
    if (!text || !isFaqSectionEndHeading(text)) continue;
    const index = heading.index ?? 0;
    return {
      section: afterFaqHeading.slice(0, index),
      rest: afterFaqHeading.slice(index),
    };
  }

  return { section: afterFaqHeading, rest: "" };
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
