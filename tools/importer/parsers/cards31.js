/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block: 2 columns, header row, each card = 1 row
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find all card content containers
  const cardContents = element.querySelectorAll('.cmp-card__content');

  cardContents.forEach(card => {
    // 1. Image (first column)
    let imgEl = null;
    const media = card.querySelector('.cmp-card__media');
    if (media) {
      // Look for <img> inside .lazy-image-container
      const img = media.querySelector('img');
      if (img) {
        imgEl = img;
      }
    }

    // 2. Text content (second column)
    // We'll assemble: Title (h5), Description (p.body-2), Details (Preparation, Serves, B Natural Drinks)
    const info = card.querySelector('.cmp-card__info');
    const textContent = document.createElement('div');
    if (info) {
      // Title
      const title = info.querySelector('.cmp-card__title h5');
      if (title) {
        textContent.appendChild(title);
      }
      // Description
      const desc = info.querySelector('.cmp-card__description p');
      if (desc) {
        textContent.appendChild(desc);
      }
      // Details (Preparation, Serves, B Natural Drinks)
      const details = info.querySelector('.cmp-card__details');
      if (details) {
        // We'll render details as a row of three columns, each with label and value
        const detailsRow = document.createElement('div');
        detailsRow.style.display = 'flex';
        detailsRow.style.gap = '1em';
        detailsRow.style.marginTop = '1em';
        const detailItems = details.querySelectorAll('.cmp-card__details-content');
        detailItems.forEach(detail => {
          const label = detail.querySelector('p');
          const value = detail.querySelector('h4');
          const cell = document.createElement('div');
          if (label) {
            cell.appendChild(label.cloneNode(true));
          }
          if (value) {
            cell.appendChild(value.cloneNode(true));
          }
          detailsRow.appendChild(cell);
        });
        textContent.appendChild(detailsRow);
      }
    }

    // Add row: [image, textContent]
    rows.push([imgEl, textContent]);
  });

  // Create and replace table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
