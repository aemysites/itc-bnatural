/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards41) block header
  const headerRow = ['Cards (cards41)'];

  // Find all anchor tags that contain card content
  const cardLinks = Array.from(element.querySelectorAll('a'));

  const rows = [headerRow];

  cardLinks.forEach((cardLink) => {
    // Find the card content container
    const cardContent = cardLink.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // --- IMAGE CELL ---
    // Find the image inside the card
    const picture = cardContent.querySelector('picture');
    let imgEl = null;
    if (picture) {
      imgEl = picture.querySelector('img');
    }
    // Defensive: fallback to null if not found
    const imageCell = imgEl ? imgEl : '';

    // --- TEXT CELL ---
    // Title (h4)
    const titleEl = cardContent.querySelector('.cmp-card__title h4');
    // Description (p.body-2)
    const descEl = cardContent.querySelector('.cmp-card__description p.body-2');
    // Details (Preparation, Serves, B Natural Drinks)
    const detailsContainer = cardContent.querySelector('.cmp-card__details');
    let detailsRow = null;
    if (detailsContainer) {
      // Each details-content is a row
      const detailRows = Array.from(detailsContainer.querySelectorAll('.cmp-card__details-content'));
      detailsRow = document.createElement('div');
      detailsRow.style.display = 'flex';
      detailsRow.style.gap = '2em';
      detailRows.forEach((row) => {
        const label = row.querySelector('p.body-4');
        const value = row.querySelector('h4');
        const span = document.createElement('span');
        if (label) span.appendChild(label.cloneNode(true));
        if (value) span.appendChild(value.cloneNode(true));
        detailsRow.appendChild(span);
      });
    }

    // Compose the text cell: Title, Description, Details
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    if (descEl) textCellContent.push(descEl);
    if (detailsRow) textCellContent.push(detailsRow);

    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(blockTable);
}
