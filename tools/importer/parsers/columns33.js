/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns33)'];

  // Defensive: Find the main teaser block (the two columns)
  // The teaser block contains both the left text and right image
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Left column: Description, lists, headings
  const leftContent = teaser.querySelector('.cmp-teaser__content');

  // Right column: Image
  const rightImageContainer = teaser.querySelector('.cmp-teaser__image');
  let rightImage = null;
  if (rightImageContainer) {
    // Find the actual image element
    rightImage = rightImageContainer.querySelector('img');
  }

  // Compose the columns row
  // Left column gets all left content (heading, lists, etc)
  // Right column gets the image element only
  const columnsRow = [
    leftContent,
    rightImage ? rightImage : document.createElement('div') // fallback empty div if no image
  ];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element with block table
  element.replaceWith(table);
}
