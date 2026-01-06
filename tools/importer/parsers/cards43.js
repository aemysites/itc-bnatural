/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards43) block header
  const headerRow = ['Cards (cards43)'];

  // Select all card content blocks
  const cardNodes = element.querySelectorAll('.cmp-card__content');
  const rows = [];

  cardNodes.forEach(card => {
    // Find the anchor (whole card is a link)
    const link = card.querySelector('a');
    // Image: get the <img> inside .cmp-card__media
    const img = card.querySelector('.cmp-card__media img');
    // Info block: contains date, category, title
    const info = card.querySelector('.cmp-card__info');

    // --- Build image cell ---
    let imageCell = null;
    if (img) {
      imageCell = img;
    }

    // --- Build text cell ---
    // Compose text: date/category, title, all as a single block
    const textCell = document.createElement('div');
    if (info) {
      // Date/category
      const dateDiv = info.querySelector('.cmp-card__date');
      if (dateDiv) {
        const dateClone = dateDiv.cloneNode(true);
        textCell.appendChild(dateClone);
      }
      // Title
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        const titleClone = titleDiv.cloneNode(true);
        textCell.appendChild(titleClone);
      }
    }
    // Make the whole text cell a link if the card is a link
    if (link && link.href) {
      const wrapper = document.createElement('a');
      wrapper.href = link.href;
      wrapper.target = link.target || '_self';
      wrapper.appendChild(textCell);
      rows.push([imageCell, wrapper]);
    } else {
      rows.push([imageCell, textCell]);
    }
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  element.replaceWith(table);
}
