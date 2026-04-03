/**
 * Cleans up legacy HTML (e.g. Drupal migrations) for proper rendering.
 *
 * - Removes stray `<br>` / `<br />` between table structural tags
 *   (`<table>`, `<tbody>`, `<thead>`, `<tr>`, `<td>`, `<th>`, closing variants)
 * - Collapses runs of 3+ `<br>` into a maximum of two
 * - Strips lone `<p>&nbsp;</p>` spacer paragraphs
 */
export function sanitizeLegacyHtml(html: string): string {
  let result = html;

  // Remove <br> tags sitting between table structural elements
  // e.g. </tr><br>\n\t\t<tr>  →  </tr><tr>
  const tableTag =
    /(<\/?\s*(?:table|thead|tbody|tfoot|tr|td|th)\b[^>]*>)\s*(?:<br\s*\/?>[\s\n\t]*)+/gi;
  // Run twice to catch cases where a <br> sits between two table tags
  result = result.replace(tableTag, "$1");
  result = result.replace(
    /(?:<br\s*\/?>[\s\n\t]*)+(\s*<\/?\s*(?:table|thead|tbody|tfoot|tr|td|th)\b)/gi,
    "$1",
  );

  // Collapse 3+ consecutive <br> into two
  result = result.replace(/(<br\s*\/?\s*>\s*){3,}/gi, "<br><br>");

  // Remove empty spacer paragraphs like <p>&nbsp;</p>
  result = result.replace(/<p>\s*(?:&nbsp;\s*)*<\/p>/gi, "");

  return result;
}
