/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cards22)'];

  // Find all card anchor elements (each card is wrapped in an <a>)
  const cardLinks = element.querySelectorAll('a');

  // Build card rows
  const rows = Array.from(cardLinks).map(card => {
    // Image: Find the <img> inside the card
    const img = card.querySelector('img');
    // Title: Find the <h3> inside the card
    const title = card.querySelector('h3');

    // Defensive: fallback to text if <h3> is missing
    let textContent;
    if (title) {
      // Use heading element directly
      textContent = title;
    } else {
      // Use text from card
      textContent = document.createElement('div');
      textContent.textContent = card.textContent.trim();
    }

    // First cell: image, second cell: title (as heading)
    return [img, textContent];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
