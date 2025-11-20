/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards14) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Find the card container (handles single or multiple cards)
  // In this source, the card is inside .cmp-card__container
  const cardContainers = element.querySelectorAll('.cmp-card__container');

  cardContainers.forEach(cardContainer => {
    // Card link wrapper (for CTA, if needed)
    const cardLink = cardContainer.querySelector('a[href]');

    // --- Column 1: Image ---
    // Get the image inside .cmp-card__media
    let imageEl = null;
    const mediaDiv = cardContainer.querySelector('.cmp-card__media');
    if (mediaDiv) {
      // Use the <img> inside <picture>
      const img = mediaDiv.querySelector('img');
      if (img) imageEl = img;
    }

    // --- Column 2: Text Content ---
    // Title (h4 inside .cmp-card__title)
    let titleEl = null;
    const infoDiv = cardContainer.querySelector('.cmp-card__info');
    if (infoDiv) {
      const titleDiv = infoDiv.querySelector('.cmp-card__title h4');
      if (titleDiv) titleEl = titleDiv;
    }

    // Description (p inside .cmp-card__description)
    let descEl = null;
    if (infoDiv) {
      const descDiv = infoDiv.querySelector('.cmp-card__description p');
      if (descDiv) descEl = descDiv;
    }

    // Details (Preparation, Serves, B Natural Drinks)
    // Each detail is in .cmp-card__details-content
    let detailsEl = null;
    const detailsDiv = infoDiv ? infoDiv.querySelector('.cmp-card__details') : null;
    if (detailsDiv) {
      // We'll build a row of details as in the screenshot
      const detailContents = detailsDiv.querySelectorAll('.cmp-card__details-content');
      const detailsRow = document.createElement('div');
      detailsRow.style.display = 'flex';
      detailsRow.style.gap = '2em';
      detailContents.forEach(detailContent => {
        // Each detailContent has a label (p.body-4) and value (h4)
        const label = detailContent.querySelector('p');
        const value = detailContent.querySelector('h4');
        const detailCol = document.createElement('div');
        if (label) detailCol.appendChild(label.cloneNode(true));
        if (value) detailCol.appendChild(value.cloneNode(true));
        detailsRow.appendChild(detailCol);
      });
      detailsEl = detailsRow;
    }

    // Compose column 2 content
    const col2Content = [];
    if (titleEl) col2Content.push(titleEl);
    if (descEl) col2Content.push(descEl);
    if (detailsEl) col2Content.push(detailsEl);
    // If the card is a link, wrap column 2 content in the link (except image)
    let col2Final;
    if (cardLink) {
      // Only wrap text content, not the image
      const link = document.createElement('a');
      link.href = cardLink.getAttribute('href');
      link.target = cardLink.getAttribute('target') || '_self';
      col2Content.forEach(n => link.appendChild(n.cloneNode(true)));
      col2Final = link;
    } else {
      col2Final = col2Content;
    }

    // Add row: [image, text content]
    rows.push([
      imageEl,
      col2Final
    ]);
  });

  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
