/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards17) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Find all card anchor elements (each card is an <a> containing .cmp-card__content)
  const cardAnchors = element.querySelectorAll('a');
  cardAnchors.forEach((cardAnchor) => {
    // Title: find .cmp-card__title h3 inside this card
    const titleEl = cardAnchor.querySelector('.cmp-card__title h3');
    // Image: find the <img> inside .cmp-card__media
    const imgEl = cardAnchor.querySelector('.cmp-card__media img');

    // Defensive: Only add if both title and image exist
    if (titleEl && imgEl) {
      // First column: image element (reference the existing img element)
      // Second column: title as heading (reference the existing h3 element)
      rows.push([
        imgEl,
        titleEl
      ]);
    }
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
