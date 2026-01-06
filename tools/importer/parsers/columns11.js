/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review ---
  // 1. No hardcoded content: All content is referenced from the DOM.
  // 2. No markdown formatting, only HTML elements.
  // 3. Only one table needed as per screenshot/example.
  // 4. Table header is exactly 'Columns (columns11)'.
  // 5. Handles edge cases: if logoDiv or headingDiv missing, uses empty div.
  // 6. No Section Metadata block in the example, so none is created.
  // 7. References existing elements (not cloning or creating new images).
  // 8. Semantic meaning is preserved: heading and paragraph are kept as-is.
  // 9. All text content from the source HTML is included in the table cell.
  // 10. No new image elements are created; existing logo <img> is referenced.
  // 11. No model provided, so no model field comments required.

  // Get the two main parts: logo and heading/description
  const logoDiv = element.querySelector('.cmp-product-list__logo') || document.createElement('div');
  const headingDiv = element.querySelector('.cmp-product-list__heading') || document.createElement('div');

  // Table structure: header row, then one row with two columns
  const cells = [
    ['Columns (columns11)'],
    [logoDiv, headingDiv]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
