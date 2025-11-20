/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block parsing
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Find all card anchor elements (each card is wrapped in an <a>)
  const cardLinks = Array.from(element.querySelectorAll('a'));

  cardLinks.forEach((cardLink) => {
    // Defensive: look for the card content container
    const cardContent = cardLink.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // --- IMAGE CELL ---
    // Find the image inside the card
    let imgEl = cardContent.querySelector('img');
    let imageCell = imgEl ? imgEl : '';

    // --- TEXT CELL ---
    // Compose the text cell: date/category, title, description (NO CTA link)
    const info = cardContent.querySelector('.cmp-card__info');
    let textCellContent = [];

    // Date/category line
    const dateEl = info && info.querySelector('.cmp-card__title p');
    if (dateEl) textCellContent.push(dateEl);

    // Title (h4)
    const titleEl = info && info.querySelector('.cmp-card__description h4');
    if (titleEl) textCellContent.push(titleEl);

    // Do NOT add a CTA link, as none is present in the screenshot or HTML
    rows.push([imageCell, textCellContent]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
