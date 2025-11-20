/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block: 2 columns, multiple rows, each card = [image, text]
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find the main grid container holding all cards
  // Cards are inside aem-Grid > div.teaser
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Select all direct card containers
  const cardDivs = Array.from(grid.querySelectorAll(':scope > div.teaser'));

  cardDivs.forEach(cardDiv => {
    // Image: find the first img inside .cmp-teaser__image
    const imageWrapper = cardDiv.querySelector('.cmp-teaser__image');
    let imageEl = null;
    if (imageWrapper) {
      imageEl = imageWrapper.querySelector('img');
    }

    // Text: find the description block
    const descWrapper = cardDiv.querySelector('.cmp-teaser__description');
    let textContent = null;
    if (descWrapper) {
      // We'll use the whole description block (includes h3, p, ul, etc)
      textContent = descWrapper;
    }

    // Defensive: Only add row if both image and text exist
    if (imageEl && textContent) {
      rows.push([imageEl, textContent]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
