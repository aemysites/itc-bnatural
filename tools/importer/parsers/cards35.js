/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards35) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards35)'];
  const rows = [headerRow];

  // Find all card content blocks
  const cardContents = element.querySelectorAll('.cmp-card__content');

  cardContents.forEach(card => {
    // The anchor wraps all card content
    const anchor = card.querySelector('a');
    if (!anchor) return;

    // Image: find first img inside .cmp-card__media
    const media = anchor.querySelector('.cmp-card__media');
    let image = null;
    if (media) {
      image = media.querySelector('img');
    }

    // Text cell: date/category + title
    const info = anchor.querySelector('.cmp-card__info');
    const textCellContent = document.createElement('div');
    if (info) {
      // Date and category
      const dateDiv = info.querySelector('.cmp-card__date');
      if (dateDiv) {
        const spans = dateDiv.querySelectorAll('span');
        const date = spans[0]?.textContent?.trim() || '';
        const category = spans[1]?.textContent?.trim() || '';
        if (date || category) {
          const p = document.createElement('p');
          p.textContent = date && category ? `${date} | ${category}` : (date || category);
          textCellContent.appendChild(p);
        }
      }
      // Title
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        const h4 = titleDiv.querySelector('h4');
        if (h4) textCellContent.appendChild(h4);
      }
    }
    // Build row: [image, text content]
    rows.push([
      image || '',
      textCellContent.childNodes.length ? textCellContent : ''
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
