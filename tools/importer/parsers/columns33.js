/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Extract left column: content
  const leftContent = teaser.querySelector('.cmp-teaser__content');
  // Extract right column: image
  const rightImage = teaser.querySelector('.cmp-teaser__image');

  // Defensive fallback for missing columns
  const leftCell = leftContent || document.createElement('div');
  const rightCell = rightImage || document.createElement('div');

  // Build table rows per Columns (columns33) spec
  const rows = [
    ['Columns (columns33)'],
    [leftCell, rightCell],
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
