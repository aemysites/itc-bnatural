/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards41) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards41)'];
  const rows = [headerRow];

  // Find the card container
  const container = element.querySelector('.cmp-card__container');
  if (!container) return;

  // Each card is an <a> containing .cmp-card__content
  const cardLinks = Array.from(container.querySelectorAll(':scope > a'));

  cardLinks.forEach((cardLink) => {
    // Card content root
    const cardContent = cardLink.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // --- Image cell ---
    // Find the image inside .cmp-card__media
    const media = cardContent.querySelector('.cmp-card__media');
    let imageEl = null;
    if (media) {
      // Use the <img> inside <picture>
      const img = media.querySelector('img');
      if (img) imageEl = img;
    }

    // --- Text cell ---
    // Compose a div with title, description, and details
    const info = cardContent.querySelector('.cmp-card__info');
    const textCell = document.createElement('div');

    // Title
    const titleH4 = info && info.querySelector('.cmp-card__title h4');
    if (titleH4) textCell.appendChild(titleH4);

    // Description
    const descP = info && info.querySelector('.cmp-card__description p');
    if (descP) textCell.appendChild(descP);

    // Details section (Preparation, Serves, B Natural Drinks)
    const details = info && info.querySelector('.cmp-card__details');
    if (details) {
      // We'll render the details as a row of three items
      const detailsRow = document.createElement('div');
      Array.from(details.querySelectorAll('.cmp-card__details-content')).forEach((detailContent) => {
        // Each detailContent has a label (p.body-4) and value (h4)
        const label = detailContent.querySelector('p.body-4');
        const value = detailContent.querySelector('h4');
        if (label && value) {
          const detailDiv = document.createElement('div');
          detailDiv.appendChild(label);
          detailDiv.appendChild(value);
          detailsRow.appendChild(detailDiv);
        }
      });
      textCell.appendChild(detailsRow);
    }

    // Add row: [image, textCell]
    rows.push([imageEl, textCell]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
