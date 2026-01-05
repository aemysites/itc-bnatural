/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards14) block: 2 columns, first row is header, subsequent rows are cards
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find the card container(s)
  // For this HTML, one card per .cmp-card--recipe-details
  const cardContainers = [element]; // Defensive: treat the element itself as a card container

  cardContainers.forEach(card => {
    // Image (mandatory, first cell)
    // Find the <picture> or <img> inside .cmp-card__media
    const media = card.querySelector('.cmp-card__media');
    let imageEl = null;
    if (media) {
      imageEl = media.querySelector('picture') || media.querySelector('img');
    }

    // Text content (mandatory, second cell)
    // We'll assemble: title, description, details
    const info = card.querySelector('.cmp-card__info');
    const textContent = document.createElement('div');
    if (info) {
      // Title
      const titleEl = info.querySelector('.cmp-card__title h4');
      if (titleEl) {
        textContent.appendChild(titleEl.cloneNode(true));
      }
      // Description
      const descEl = info.querySelector('.cmp-card__description p');
      if (descEl) {
        textContent.appendChild(descEl.cloneNode(true));
      }
      // Details (Preparation, Serves, B Natural Drinks)
      const details = info.querySelector('.cmp-card__details');
      if (details) {
        // We'll render the details as a horizontal row
        const detailsRow = document.createElement('div');
        detailsRow.style.display = 'flex';
        detailsRow.style.gap = '2em';
        Array.from(details.querySelectorAll('.cmp-card__details-content')).forEach(detail => {
          const label = detail.querySelector('p');
          const value = detail.querySelector('h4');
          const detailCol = document.createElement('div');
          if (label) detailCol.appendChild(label.cloneNode(true));
          if (value) detailCol.appendChild(value.cloneNode(true));
          detailsRow.appendChild(detailCol);
        });
        textContent.appendChild(detailsRow);
      }
    }

    // Add the card row: [image, textContent]
    rows.push([
      imageEl,
      textContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
