/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review ---
  // 1. No hardcoded text: All content is referenced from the DOM.
  // 2. No markdown formatting: Only HTML elements are used.
  // 3. Only one table is needed for this columns block.
  // 4. Header row matches exactly: 'Columns (columns6)'.
  // 5. Handles missing/empty elements: fallback to empty divs.
  // 6. No Section Metadata in the example, so none is created.
  // 7. Existing elements are referenced (not cloned or created new, except for fallback empty divs).
  // 8. Semantic meaning is preserved: headings, paragraphs, select, etc. remain intact.
  // 9. All text content is included in the referenced elements.
  // 10. No new images are created (none present in the source).
  // 11. No model provided, so no field comments needed.

  // Extract left and right columns
  const leftCol = element.querySelector('.video-details');
  const rightCol = element.querySelector('.cmp-dropdown');

  // Defensive: fallback to empty divs if missing
  const leftContent = leftCol || document.createElement('div');
  const rightContent = rightCol || document.createElement('div');

  // Build the columns table
  const cells = [
    ['Columns (columns6)'],
    [leftContent, rightContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
