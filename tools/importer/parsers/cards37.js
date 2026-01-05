/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards37) block: 2 columns, multiple rows, each row is a card
  // Header row
  const headerRow = ['Cards (cards37)'];

  // Find all card links (each <a.cmp-product-list__link> is a card)
  const cardLinks = element.querySelectorAll('a.cmp-product-list__link');
  const rows = [headerRow];

  cardLinks.forEach((cardLink) => {
    // Image: Use the first <picture> (default image)
    const contentDiv = cardLink.querySelector('.cmp-product-list__content');
    let imgEl = null;
    if (contentDiv) {
      const firstPicture = contentDiv.querySelector('picture');
      if (firstPicture) {
        // Use the first <img> inside first <picture>
        imgEl = firstPicture.querySelector('img');
      }
    }

    // Text cell: Title (from data-title or details), description, available sizes
    const detailsDiv = cardLink.querySelector('.cmp-product-list__details');
    let titleText = cardLink.getAttribute('data-title') || '';
    let titleEl = null;
    if (titleText) {
      titleEl = document.createElement('h3');
      titleEl.textContent = titleText;
    }

    // Description
    let descEl = detailsDiv ? detailsDiv.querySelector('.cmp-product-list__details-description') : null;

    // Available sizes
    let availDiv = detailsDiv ? detailsDiv.querySelector('.cmp-product-list__available-details') : null;
    let availEls = [];
    if (availDiv) {
      // Use all children of available-details
      availEls = Array.from(availDiv.children);
    }

    // Compose text cell: title, description, available sizes
    const textCell = [];
    if (titleEl) textCell.push(titleEl);
    if (descEl) textCell.push(descEl);
    if (availEls.length) textCell.push(...availEls);

    rows.push([
      imgEl || '',
      textCell
    ]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
