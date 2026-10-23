/**
 * Utility functions for text formatting, HTML stripping, and sorting.
 */

/** Strip all HTML tags, decoding entities, for clean card excerpts and previews */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** Helper to extract an approximate timestamp from an item ID or date string */
export function extractTimestamp(id: string, dateStr?: string): number {
  if (id) {
    const match = id.match(/\d{10,}/);
    if (match) {
      const num = Number(match[0]);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  if (dateStr) {
    const parsed = Date.parse(dateStr);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

/** Sort items with newest / latest first */
export function sortByLatest<T extends { id: string; date?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const timeA = extractTimestamp(a.id, a.date);
    const timeB = extractTimestamp(b.id, b.date);
    if (timeA && timeB && timeA !== timeB) {
      return timeB - timeA;
    }
    if (timeA && !timeB) return -1;
    if (!timeA && timeB) return 1;
    return 0;
  });
}
