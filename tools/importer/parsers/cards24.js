/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block header row
  const headerRow = ['Cards (cards24)'];

  // Find all card anchor wrappers (each card is an <a> containing .cmp-card__content)
  const cardLinks = Array.from(element.querySelectorAll(':scope > .cmp-card__container > a'));

  const rows = cardLinks.map((a) => {
    // Find the image (inside <picture> in .cmp-card__media)
    let imageEl = null;
    const media = a.querySelector('.cmp-card__media');
    if (media) {
      const img = media.querySelector('img');
      if (img) imageEl = img;
    }

    // Build the text content cell
    const info = a.querySelector('.cmp-card__info');
    const textNodes = [];
    if (info) {
      // Date/category line
      const dateLine = info.querySelector('.cmp-card__title');
      if (dateLine && dateLine.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = dateLine.textContent.trim();
        textNodes.push(p);
      }
      // Title/description
      const desc = info.querySelector('.cmp-card__description');
      if (desc) {
        const h = desc.querySelector('h1, h2, h3, h4, h5, h6');
        if (h) textNodes.push(h);
      }
    }

    // Compose the text cell fragment
    const textCell = document.createElement('div');
    textNodes.forEach((n) => textCell.appendChild(n));

    return [imageEl, textCell];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
