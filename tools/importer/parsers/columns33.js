/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract left column: content
  const contentCol = teaser.querySelector('.cmp-teaser__content');
  // Extract right column: image
  const imageCol = teaser.querySelector('.cmp-teaser__image');

  // Defensive: If either is missing, fallback to the whole teaser
  const leftCell = contentCol || teaser;
  const rightCell = imageCol || '';

  // Table: header row, then content row
  const rows = [
    ['Columns (columns33)'],
    [leftCell, rightCell]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
