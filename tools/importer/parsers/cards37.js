/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards37) block: 2 columns, each row is a card: [image, text content]
  const headerRow = ['Cards (cards37)'];
  const rows = [headerRow];

  // Select all card anchor links (each is a card)
  const cardLinks = element.querySelectorAll('a.cmp-product-list__link');

  cardLinks.forEach((cardLink) => {
    // Find the main card content container
    const cardContent = cardLink.querySelector('.cmp-product-list__content');
    if (!cardContent) return;

    // Get the first picture (main image)
    const mainPicture = cardContent.querySelector('picture');
    let imageEl = null;
    if (mainPicture) {
      // Use the first img inside the first picture
      imageEl = mainPicture.querySelector('img');
    }

    // Get the details container
    const details = cardContent.querySelector('.cmp-product-list__details');
    let textCellContent = [];
    // Title: Use the anchor's data-title attribute as heading
    const titleText = cardLink.getAttribute('data-title');
    if (titleText) {
      const heading = document.createElement('h3');
      heading.textContent = titleText;
      textCellContent.push(heading);
    }
    if (details) {
      // Description
      const desc = details.querySelector('.cmp-product-list__details-description');
      if (desc) {
        textCellContent.push(desc);
      }
      // Available details
      const avail = details.querySelector('.cmp-product-list__available-details');
      if (avail) {
        textCellContent.push(avail);
      }
    }

    // Add the row: [image, text content]
    rows.push([
      imageEl || '',
      textCellContent
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
