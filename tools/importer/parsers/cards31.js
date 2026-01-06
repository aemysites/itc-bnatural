/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block header
  const headerRow = ['Cards (cards31)'];

  // Find all card content blocks
  const cardContents = element.querySelectorAll('.cmp-card__content');
  const rows = [];

  cardContents.forEach((card) => {
    // Find the anchor tag that wraps the card
    const anchor = card.querySelector('a[href]');
    let href = anchor ? anchor.getAttribute('href') : null;

    // --- IMAGE CELL ---
    let imgEl = card.querySelector('.cmp-card__media img');
    if (!imgEl) {
      const pic = card.querySelector('.cmp-card__media picture');
      imgEl = pic ? pic : '';
    }

    // --- TEXT CELL ---
    const info = card.querySelector('.cmp-card__info');
    let titleEl = null;
    if (info) {
      const allTitles = info.querySelectorAll('.cmp-card__title h5');
      for (const t of allTitles) {
        if (!t.closest('.cmp-card__details')) {
          titleEl = t;
          break;
        }
      }
    }
    const descEl = card.querySelector('.cmp-card__description p');
    const details = card.querySelectorAll('.cmp-card__details-content');
    const detailsRow = document.createElement('div');
    details.forEach((detail) => {
      const label = detail.querySelector('p');
      const value = detail.querySelector('h4');
      const detailDiv = document.createElement('div');
      if (label) {
        detailDiv.appendChild(label.cloneNode(true));
      }
      if (value) {
        detailDiv.appendChild(value.cloneNode(true));
      }
      detailsRow.appendChild(detailDiv);
    });

    // Compose text cell
    const textCell = document.createElement('div');
    if (titleEl) textCell.appendChild(titleEl.cloneNode(true));
    if (descEl) textCell.appendChild(descEl.cloneNode(true));
    textCell.appendChild(detailsRow);

    // Wrap image and text in anchor if href exists
    let imageCell = imgEl;
    let textCellFinal = textCell;
    if (href) {
      const aImg = document.createElement('a');
      aImg.href = href;
      aImg.appendChild(imgEl.cloneNode(true));
      imageCell = aImg;

      const aText = document.createElement('a');
      aText.href = href;
      // Use textCell's children
      Array.from(textCell.childNodes).forEach(child => aText.appendChild(child.cloneNode(true)));
      textCellFinal = aText;
    }

    rows.push([imageCell, textCellFinal]);
  });

  // Compose table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  element.replaceWith(table);
}
