/* global WebImporter */
export default function parse(element, { document }) {
  // Columns block header row
  const headerRow = ['Columns (columns6)'];

  // Identify left and right columns
  const leftCol = element.querySelector('.video-details');
  const rightCol = element.querySelector('.cmp-dropdown');

  // Defensive fallback for missing columns
  const leftCell = leftCol ? leftCol : document.createElement('div');
  const rightCell = rightCol ? rightCol : document.createElement('div');

  // Ensure all text content is preserved, and reference existing elements
  // No images present, no Section Metadata

  // Compose table rows
  const rows = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
