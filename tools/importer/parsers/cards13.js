/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card links (each card is an <a> with .cmp-card__content inside)
  const cardLinks = Array.from(element.querySelectorAll('.cmp-card__container > a'));

  // Header row as required
  const rows = [['Cards (cards13)']];

  cardLinks.forEach(cardLink => {
    // Image: Find the <img> inside the card
    const img = cardLink.querySelector('.cmp-card__media img');
    let imageEl = null;
    if (img) {
      imageEl = img;
    }

    // Text content cell: build a fragment
    const frag = document.createElement('div');
    // Title
    const title = cardLink.querySelector('.cmp-card__title h4');
    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent;
      frag.appendChild(h4);
    }
    // Description
    const desc = cardLink.querySelector('.cmp-card__description p');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent;
      frag.appendChild(p);
    }
    // Details (Preparation, Serves, B Natural Drinks)
    const details = cardLink.querySelectorAll('.cmp-card__details-content');
    if (details.length > 0) {
      const detailsRow = document.createElement('div');
      detailsRow.style.display = 'flex';
      detailsRow.style.gap = '1em';
      details.forEach(detail => {
        const label = detail.querySelector('p');
        const value = detail.querySelector('h4');
        if (label && value) {
          const detailDiv = document.createElement('div');
          detailDiv.appendChild(document.createElement('div')).textContent = label.textContent;
          detailDiv.appendChild(document.createElement('div')).textContent = value.textContent;
          detailsRow.appendChild(detailDiv);
        }
      });
      frag.appendChild(detailsRow);
    }
    // DO NOT invent a CTA link; the original HTML does not have one

    rows.push([imageEl, frag]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
