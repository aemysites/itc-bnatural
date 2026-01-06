/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Only extract product cards (not the header section)
  const cardContainer = element.querySelector('.cmp-product-list__container');
  if (!cardContainer) return;
  const cardLinks = cardContainer.querySelectorAll('.cmp-product-list__link');

  cardLinks.forEach((cardLink) => {
    // Get the main (default) image for the card
    const img = cardLink.querySelector('img.cmp-image__default');

    // Build the text content cell
    const textCell = document.createElement('div');

    // Product name as heading (from image title or alt if available)
    let cardTitle = '';
    if (img) {
      cardTitle = img.getAttribute('title') || img.getAttribute('alt') || '';
    }
    if (cardTitle) {
      const h2 = document.createElement('h2');
      h2.textContent = cardTitle;
      textCell.appendChild(h2);
    }

    // Add details-description
    const detailsDesc = cardLink.querySelector('.cmp-product-list__details-description');
    if (detailsDesc) {
      textCell.appendChild(document.createTextNode(detailsDesc.textContent));
    }

    // Add available details (as separate lines)
    const avail = cardLink.querySelector('.cmp-product-list__available-details');
    if (avail) {
      const availP = avail.querySelector('p');
      const availH2 = avail.querySelector('h2');
      if (availP && availH2) {
        const availDiv = document.createElement('div');
        availDiv.innerHTML = `${availP.textContent}<br><strong>${availH2.textContent}</strong>`;
        textCell.appendChild(availDiv);
      }
    }

    // Add the row: [image, text cell]
    rows.push([
      img || '',
      textCell
    ]);
  });

  // Create the cards table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
