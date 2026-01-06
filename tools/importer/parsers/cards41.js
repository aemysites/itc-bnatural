/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards41)'];

  // Find all card anchor elements (each card is an <a> with .cmp-card__content inside)
  const cardLinks = element.querySelectorAll('.cmp-card__container > a');

  const rows = Array.from(cardLinks).map((cardLink) => {
    // Image: .cmp-card__media img (first img inside the card)
    const img = cardLink.querySelector('.cmp-card__media img');
    const imgClone = img ? img.cloneNode(true) : document.createElement('div');

    // Text content: .cmp-card__info (flattened)
    const info = cardLink.querySelector('.cmp-card__info');
    let textCell = document.createElement('div');
    if (info) {
      // Extract title
      const title = info.querySelector('.cmp-card__title h4');
      if (title) {
        const h = document.createElement('h3');
        h.textContent = title.textContent;
        textCell.appendChild(h);
      }
      // Extract description
      const desc = info.querySelector('.cmp-card__description p');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent;
        textCell.appendChild(p);
      }
      // Extract details
      const details = info.querySelectorAll('.cmp-card__details-content');
      details.forEach((detail) => {
        const label = detail.querySelector('p');
        const value = detail.querySelector('h4');
        if (label && value) {
          const d = document.createElement('p');
          d.innerHTML = `<strong>${label.textContent}:</strong> ${value.textContent}`;
          textCell.appendChild(d);
        }
      });
    }
    return [imgClone, textCell];
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  element.replaceWith(table);
}
