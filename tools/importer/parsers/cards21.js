/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cards21)'];

  // Find the card container
  const cardsContainer = element.querySelector('.cmp-product-list__container');
  if (!cardsContainer) return;

  // Get all card links (each card is an <a> with class 'cmp-product-list__link')
  const cardLinks = Array.from(cardsContainer.querySelectorAll('.cmp-product-list__link'));

  // For each card, extract image and all text content
  const cardRows = cardLinks.map(link => {
    // Get the first <img> inside the card (the main product image)
    const img = link.querySelector('picture img');

    // Compose the card text content
    const textDiv = document.createElement('div');

    // 1. Vertical product name (decorative text)
    const verticalName = link.getAttribute('data-title');
    if (verticalName) {
      const vertEl = document.createElement('div');
      vertEl.textContent = verticalName;
      vertEl.style.writingMode = 'vertical-lr'; // hint for vertical rendering
      textDiv.appendChild(vertEl);
    }

    // 2. Product title (from image title or alt)
    const imgTitle = img ? (img.getAttribute('title') || img.getAttribute('alt')) : '';
    if (imgTitle) {
      const titleEl = document.createElement('h2');
      titleEl.textContent = imgTitle;
      textDiv.appendChild(titleEl);
    }

    // 3. Details (description, available in)
    const details = link.querySelector('.cmp-product-list__details');
    if (details) {
      Array.from(details.childNodes).forEach(node => {
        textDiv.appendChild(node.cloneNode(true));
      });
    }

    return [img, textDiv];
  });

  // Extract header/logo and description from the top section
  const infoSection = element.querySelector('.cmp-product-list__information');
  if (infoSection) {
    // Logo image
    const logoImg = infoSection.querySelector('.cmp-product-list__logo img');
    // Heading and description
    const heading = infoSection.querySelector('.cmp-product-list__heading h2');
    const desc = infoSection.querySelector('.cmp-product-list__heading p');
    if (logoImg || heading || desc) {
      const headerTextDiv = document.createElement('div');
      if (heading) headerTextDiv.appendChild(heading.cloneNode(true));
      if (desc) headerTextDiv.appendChild(desc.cloneNode(true));
      cardRows.unshift([logoImg, headerTextDiv]);
    }
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
