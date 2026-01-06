/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards14) block: 2 columns, first row is header, subsequent rows are cards
  const headerRow = ['Cards (cards14)'];

  // Find the card container
  const cardContainer = element.querySelector('.cmp-card__container');
  if (!cardContainer) return;

  // Find the anchor (for possible CTA)
  const cardLink = cardContainer.querySelector('a[href]');

  // Image (mandatory)
  let imageEl = null;
  const media = cardContainer.querySelector('.cmp-card__media');
  if (media) {
    imageEl = media.querySelector('img');
  }

  // Text content (mandatory)
  const info = cardContainer.querySelector('.cmp-card__info');
  let textContent = document.createElement('div');
  if (info) {
    // Title
    const titleEl = info.querySelector('.cmp-card__title h4');
    if (titleEl) {
      textContent.appendChild(titleEl);
    }
    // Description
    const descEl = info.querySelector('.cmp-card__description p');
    if (descEl) {
      textContent.appendChild(descEl);
    }
    // Details (Preparation, Serves, B Natural Drinks)
    const details = info.querySelector('.cmp-card__details');
    if (details) {
      // We'll combine all details into a single row below the description
      const detailsRow = document.createElement('div');
      detailsRow.style.display = 'flex';
      detailsRow.style.gap = '2em';
      detailsRow.style.marginTop = '1em';
      detailsRow.style.fontSize = 'small';
      const detailItems = details.querySelectorAll('.cmp-card__details-content');
      detailItems.forEach((item) => {
        const label = item.querySelector('p');
        const value = item.querySelector('h4');
        if (label && value) {
          const detailDiv = document.createElement('div');
          detailDiv.appendChild(label.cloneNode(true));
          detailDiv.appendChild(value.cloneNode(true));
          detailsRow.appendChild(detailDiv);
        }
      });
      textContent.appendChild(detailsRow);
    }
    // CTA: If the card is wrapped in a link, add a CTA at the bottom
    if (cardLink && cardLink.getAttribute('href')) {
      const cta = document.createElement('div');
      const link = document.createElement('a');
      link.href = cardLink.getAttribute('href');
      link.textContent = 'View Recipe';
      cta.appendChild(link);
      cta.style.marginTop = '1em';
      textContent.appendChild(cta);
    }
  }

  // Build the table rows
  const rows = [headerRow];
  rows.push([
    imageEl,
    textContent
  ]);

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
