/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review ---
  // 1. No hardcoded content; all content is referenced from the DOM.
  // 2. No markdown formatting; only HTML elements are used.
  // 3. Only one table is needed for this block.
  // 4. Header row matches: Columns (columns6)
  // 5. Handles missing/empty elements with fallback empty divs.
  // 6. No Section Metadata block in the example, so none is created.
  // 7. Existing elements are referenced, not cloned or recreated.
  // 8. Semantic meaning (headings, paragraphs) is preserved by referencing the DOM.
  // 9. All text content from the source is included in a table cell.
  // 10. No new image elements are created.
  // 11. No model provided, so no html comments for model fields.

  // Header row for Columns block
  const headerRow = ['Columns (columns6)'];

  // Get left column: video-details (title, producer, location)
  const videoDetails = element.querySelector('.video-details');

  // Get right column: cmp-dropdown (dropdown label and select)
  const dropdown = element.querySelector('.cmp-dropdown');

  // Defensive: If either column is missing, fallback to empty div
  const leftCol = videoDetails || document.createElement('div');
  const rightCol = dropdown || document.createElement('div');

  // Table structure: header, then one row with two columns
  const cells = [
    headerRow,
    [leftCol, rightCol],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
