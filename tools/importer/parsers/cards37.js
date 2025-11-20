/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // Find all card links (each card is an <a.cmp-product-list__link>)
  const cardLinks = element.querySelectorAll('a.cmp-product-list__link');

  cardLinks.forEach((cardLink) => {
    // --- IMAGE CELL ---
    // The main card image is the first <picture> in the card
    const contentDiv = cardLink.querySelector('.cmp-product-list__content');
    let imageCell = null;
    if (contentDiv) {
      const firstPicture = contentDiv.querySelector('picture');
      if (firstPicture) {
        // Use the <img> inside the first <picture>
        const img = firstPicture.querySelector('img');
        if (img) imageCell = img;
        else imageCell = firstPicture;
      }
    }
    // Defensive fallback: if no image found, leave cell empty
    if (!imageCell) imageCell = document.createElement('span');

    // --- TEXT CELL ---
    // Compose: Title, Description, Available sizes
    const detailsDiv = contentDiv ? contentDiv.querySelector('.cmp-product-list__details') : null;
    const textCellContent = [];
    if (detailsDiv) {
      // Title: use the cardLink's data-title attribute (or fallback to img alt/title)
      let titleText = cardLink.getAttribute('data-title');
      if (!titleText) {
        // Fallback: try image alt/title
        const img = imageCell;
        titleText = img && img.getAttribute ? (img.getAttribute('title') || img.getAttribute('alt')) : '';
      }
      if (titleText) {
        const titleEl = document.createElement('h2');
        titleEl.textContent = titleText;
        textCellContent.push(titleEl);
      }
      // Description
      const descP = detailsDiv.querySelector('.cmp-product-list__details-description');
      if (descP) textCellContent.push(descP);
      // Available sizes
      const availDiv = detailsDiv.querySelector('.cmp-product-list__available-details');
      if (availDiv) {
        // Compose 'Available in' label and sizes
        const availLabel = availDiv.querySelector('p');
        const availSizes = availDiv.querySelector('h2');
        if (availLabel || availSizes) {
          const availWrap = document.createElement('div');
          if (availLabel) availWrap.appendChild(availLabel);
          if (availSizes) availWrap.appendChild(availSizes);
          textCellContent.push(availWrap);
        }
      }
    }
    // Defensive fallback: if no text, leave cell empty
    if (textCellContent.length === 0) {
      textCellContent.push(document.createElement('span'));
    }

    // Add row: [image, text]
    rows.push([imageCell, textCellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
