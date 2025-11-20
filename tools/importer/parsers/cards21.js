/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // 2. Extract card parent container
  const productList = element.querySelector('.cmp-product-list__container');
  if (!productList) return;

  // 3. Find all card links (each card is an <a> with .cmp-product-list__link)
  const cardLinks = productList.querySelectorAll('.cmp-product-list__link');

  cardLinks.forEach((cardLink) => {
    // Image: Use the first <img> inside the card
    const img = cardLink.querySelector('img');
    const textContent = [];

    // --- Get ALL relevant text content from the card ---
    // Product name (from image title attribute, e.g. 'Guava', 'Mixed Fruit')
    const productName = cardLink.querySelector('img')?.getAttribute('title');
    if (productName) {
      const headingEl = document.createElement('strong');
      headingEl.textContent = productName;
      textContent.push(headingEl);
    }

    // Product title (from .cmp-product-list__details-description's previous sibling, e.g. 'NO ADDED SUGAR GUAVA')
    // In this HTML, the image alt/title is the product name, but the bottle label text ('NO ADDED SUGAR GUAVA') is not in the HTML, so we skip it.

    // Description: paragraph inside details
    const details = cardLink.querySelector('.cmp-product-list__details');
    const desc = details ? details.querySelector('.cmp-product-list__details-description') : null;
    if (desc) {
      textContent.push(document.createElement('br'));
      textContent.push(desc.cloneNode(true));
    }

    // Available details: size info
    const avail = details ? details.querySelector('.cmp-product-list__available-details') : null;
    if (avail) {
      textContent.push(document.createElement('br'));
      const availText = avail.querySelector('p')?.textContent.trim();
      const sizeEl = avail.querySelector('h2');
      if (availText && sizeEl) {
        const availSpan = document.createElement('span');
        availSpan.textContent = availText + ' ';
        textContent.push(availSpan);
        const sizeStrong = document.createElement('strong');
        sizeStrong.textContent = sizeEl.textContent.trim();
        textContent.push(sizeStrong);
      }
    }

    // Add card row: [image, textContent]
    rows.push([img, textContent]);
  });

  // 4. Replace element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
