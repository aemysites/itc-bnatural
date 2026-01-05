/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns11)'];

  // Extract left column: logo image
  const logoDiv = element.querySelector('.cmp-product-list__logo');
  let logoImg = '';
  if (logoDiv) {
    const img = logoDiv.querySelector('img');
    if (img) logoImg = img;
  }

  // Extract right column: heading and description
  const headingDiv = element.querySelector('.cmp-product-list__heading');
  let rightColumn = '';
  if (headingDiv) {
    // Collect all element children (h2, p, etc.)
    rightColumn = document.createElement('div');
    Array.from(headingDiv.children).forEach(child => {
      rightColumn.appendChild(child);
    });
  }

  // Compose columns row
  const columnsRow = [logoImg, rightColumn];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
