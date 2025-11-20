/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns11)'];

  // Defensive: Get immediate children
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find logo image (left column)
  let logoImg = null;
  const logoDiv = children.find(div => div.classList.contains('cmp-product-list__logo'));
  if (logoDiv) {
    logoImg = logoDiv.querySelector('img');
  }

  // Find heading and description (right column)
  let headingContent = [];
  const headingDiv = children.find(div => div.classList.contains('cmp-product-list__heading'));
  if (headingDiv) {
    // Grab heading (h2) and description (p)
    const h2 = headingDiv.querySelector('h2');
    const p = headingDiv.querySelector('p');
    if (h2) headingContent.push(h2);
    if (p) headingContent.push(p);
  }

  // Build columns row: [logo image, heading+description]
  const columnsRow = [logoImg, headingContent];

  // Compose table rows
  const rows = [headerRow, columnsRow];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
