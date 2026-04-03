/**
 * Cleans up legacy HTML (e.g. Drupal migrations) for proper rendering.
 */
export function sanitizeLegacyHtml(html: string): string {
  let result = html;

  // Remove <br> tags between table structural elements
  const tableTag =
    /(<\/?\s*(?:table|thead|tbody|tfoot|tr|td|th)\b[^>]*>)\s*(?:<br\s*\/?>[\s\n\t]*)+/gi;
  result = result.replace(tableTag, "$1");
  result = result.replace(
    /(?:<br\s*\/?>[\s\n\t]*)+(\s*<\/?\s*(?:table|thead|tbody|tfoot|tr|td|th)\b)/gi,
    "$1",
  );

  // Remove empty first-column cells: <td>&nbsp;</td> or <td> </td>
  result = result.replace(/<td>\s*(?:&nbsp;\s*)*<\/td>/gi, "");

  // Collapse 3+ consecutive <br> into two
  result = result.replace(/(<br\s*\/?\s*>\s*){3,}/gi, "<br><br>");

  // Remove empty spacer paragraphs like <p>&nbsp;</p>
  result = result.replace(/<p>\s*(?:&nbsp;\s*)*<\/p>/gi, "");

  return result;
}

/**
 * Strips HTML tags from a string, returning plain text.
 * Used for SEO meta descriptions that may contain legacy HTML.
 */
export function stripHtmlTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
