/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards43) block
  const headerRow = ['Cards (cards43)'];
  const rows = [headerRow];

  // Each card is a .cmp-card__content
  const cardEls = element.querySelectorAll('.cmp-card__content');

  cardEls.forEach(card => {
    // Find the anchor (whole card is a link)
    const link = card.querySelector('a');
    if (!link) return;

    // --- IMAGE CELL ---
    // Find the image inside the card
    let imgEl = link.querySelector('img');
    // Defensive: wrap in a div for consistency with screenshots
    let imgCell;
    if (imgEl) {
      // Use the picture element if present for better semantics
      const picture = imgEl.closest('picture');
      imgCell = picture ? picture : imgEl;
    } else {
      imgCell = '';
    }

    // --- TEXT CELL ---
    // Compose the text cell
    const info = link.querySelector('.cmp-card__info');
    let textCellContent = [];
    if (info) {
      // Date & category
      const dateDiv = info.querySelector('.cmp-card__date');
      if (dateDiv) {
        // Join all text nodes in dateDiv
        const dateText = Array.from(dateDiv.childNodes).map(n => n.textContent.trim()).filter(Boolean).join(' | ');
        if (dateText) {
          const dateP = document.createElement('p');
          dateP.textContent = dateText;
          dateP.style.marginBottom = '0.5em';
          textCellContent.push(dateP);
        }
      }
      // Title
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        // Use the h4 or text inside
        const h4 = titleDiv.querySelector('h4');
        if (h4) {
          const heading = document.createElement('strong');
          heading.textContent = h4.textContent.trim();
          textCellContent.push(heading);
        }
      }
    }
    // If no info, fallback to link text
    if (textCellContent.length === 0) {
      textCellContent.push(link.textContent.trim());
    }
    // Wrap all text in a div and link the whole cell
    const textDiv = document.createElement('div');
    textCellContent.forEach(el => textDiv.appendChild(el));
    // Make the whole text cell a link
    const cardLink = document.createElement('a');
    cardLink.href = link.href;
    cardLink.appendChild(textDiv);
    // Add to rows
    rows.push([imgCell, cardLink]);
  });

  // Create the table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
