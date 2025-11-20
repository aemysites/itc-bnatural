/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block - extract multiple cards from a container
  const headerRow = ['Cards (cards29)']; // Only one column in header row
  const rows = [headerRow];

  // Select all card links (each card is an <a> containing card content)
  const cardLinks = element.querySelectorAll('.cmp-product-list__link');

  cardLinks.forEach((cardLink) => {
    // Find the card content container
    const cardContent = cardLink.querySelector('.cmp-product-list__content');
    if (!cardContent) return;

    // --- IMAGE CELL ---
    // Use both <picture> elements (default and hover)
    const pictures = cardContent.querySelectorAll('picture');
    let imageCell = [];
    pictures.forEach((pic) => imageCell.push(pic));
    if (imageCell.length === 1) imageCell = imageCell[0];

    // --- TEXT CELL ---
    // Product name (from link data-title)
    const productName = cardLink.getAttribute('data-title') || '';
    let headingEl = null;
    if (productName) {
      headingEl = document.createElement('h3');
      headingEl.textContent = productName;
    }

    // Details container
    const details = cardContent.querySelector('.cmp-product-list__details');
    let textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (details) {
      // Description
      const desc = details.querySelector('.cmp-product-list__details-description');
      if (desc) {
        textCellContent.push(desc);
      }
      // Available details (size)
      const available = details.querySelector('.cmp-product-list__available-details');
      if (available) {
        textCellContent.push(available);
      }
    }
    // Defensive: If no details, fallback to all text in cardContent
    if (textCellContent.length === 0) {
      // Get all paragraphs and headings
      const fallbackTexts = cardContent.querySelectorAll('p, h2, h3, h4');
      fallbackTexts.forEach((el) => textCellContent.push(el));
    }
    // Do NOT add a CTA link unless it exists in the source (none in this case)

    // Add card row: [image, text]
    rows.push([imageCell, textCellContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
