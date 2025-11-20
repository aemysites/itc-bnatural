/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block parser
  // 1. Header row
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  // Find the parent container for cards
  // Each card is an <a> containing a .cmp-card__content div
  const cardLinks = element.querySelectorAll('.cmp-card__container > a');

  cardLinks.forEach((cardLink) => {
    // Image extraction: Find the <img> inside .cmp-card__media
    const mediaDiv = cardLink.querySelector('.cmp-card__media');
    let imageEl = null;
    if (mediaDiv) {
      imageEl = mediaDiv.querySelector('img');
    }

    // Text content extraction
    const infoDiv = cardLink.querySelector('.cmp-card__info');
    const cardTextContent = [];
    if (infoDiv) {
      // Title (h4)
      const titleDiv = infoDiv.querySelector('.cmp-card__title h4');
      if (titleDiv) {
        cardTextContent.push(titleDiv);
      }
      // Description (p.body-2)
      const descDiv = infoDiv.querySelector('.cmp-card__description p');
      if (descDiv) {
        cardTextContent.push(descDiv);
      }
      // Details (Preparation, Serves, B Natural Drinks)
      const detailsDiv = infoDiv.querySelector('.cmp-card__details');
      if (detailsDiv) {
        // We'll render the details as a horizontal row (as in screenshot)
        // Each .cmp-card__details-content contains a label (p.body-4) and value (h4)
        const detailsContentEls = detailsDiv.querySelectorAll('.cmp-card__details-content');
        if (detailsContentEls.length > 0) {
          // Create a details row container
          const detailsRow = document.createElement('div');
          detailsRow.style.display = 'flex';
          detailsRow.style.gap = '1em';
          detailsContentEls.forEach((detail) => {
            const label = detail.querySelector('p.body-4');
            const value = detail.querySelector('h4');
            const detailCol = document.createElement('div');
            if (label) detailCol.appendChild(label.cloneNode(true));
            if (value) detailCol.appendChild(value.cloneNode(true));
            detailsRow.appendChild(detailCol);
          });
          cardTextContent.push(detailsRow);
        }
      }
    }

    // Compose table row: [image, text content]
    const cardRow = [imageEl, cardTextContent];
    rows.push(cardRow);
  });

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(blockTable);
}
