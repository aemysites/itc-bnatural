/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards43) block: 2 columns, multiple rows, header is always ['Cards (cards43)']
  const headerRow = ['Cards (cards43)'];
  const rows = [headerRow];

  // Find all direct card content containers
  const cardContents = element.querySelectorAll('.cmp-card__content');

  cardContents.forEach((cardContent) => {
    // Each card is wrapped in an anchor
    const link = cardContent.querySelector('a');
    if (!link) return;

    // --- IMAGE CELL ---
    // Find image inside the card
    let imageEl = null;
    const img = link.querySelector('img');
    if (img) {
      imageEl = img;
    }

    // --- TEXT CELL ---
    // Compose text cell: date/category, title
    const info = link.querySelector('.cmp-card__info');
    const textCell = document.createElement('div');

    // Date and category
    const dateDiv = info && info.querySelector('.cmp-card__date');
    if (dateDiv) {
      Array.from(dateDiv.children).forEach((span) => {
        if (span.textContent.trim()) {
          const dateSpan = document.createElement('div');
          dateSpan.textContent = span.textContent.trim();
          textCell.appendChild(dateSpan);
        }
      });
    }

    // Title
    const titleDiv = info && info.querySelector('.cmp-card__title');
    if (titleDiv) {
      const h4 = titleDiv.querySelector('h4');
      if (h4) {
        textCell.appendChild(h4);
      }
    }

    // Add row: [image, text content]
    rows.push([
      imageEl,
      textCell
    ]);
  });

  // Create table and replace original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
