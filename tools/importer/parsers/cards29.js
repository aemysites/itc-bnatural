/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Cards block
  const headerRow = ['Cards (cards29)'];

  // Find all card links in the container
  const cardLinks = element.querySelectorAll('a.cmp-product-list__link');

  // Prepare card rows
  const cardRows = Array.from(cardLinks).map((cardLink) => {
    // Get card content
    const content = cardLink.querySelector('.cmp-product-list__content');
    if (!content) return null;

    // Get the first (default) product image (not hover)
    const defaultPicture = content.querySelector('picture');
    let imageEl = null;
    if (defaultPicture) {
      imageEl = defaultPicture.querySelector('img');
    }

    // Get product title from data-title attribute on <a>
    const productTitle = cardLink.getAttribute('data-title');
    let headingEl = null;
    if (productTitle) {
      headingEl = document.createElement('h2');
      headingEl.textContent = productTitle;
    }

    // Get details section
    const details = content.querySelector('.cmp-product-list__details');
    let textCellContent = [];
    if (headingEl) textCellContent.push(headingEl);
    if (details) {
      // Description
      const desc = details.querySelector('.cmp-product-list__details-description');
      if (desc) textCellContent.push(desc);
      // Available in section
      const avail = details.querySelector('.cmp-product-list__available-details');
      if (avail) {
        textCellContent.push(avail);
      }
    }

    return [imageEl, textCellContent];
  }).filter(Boolean);

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
