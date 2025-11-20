/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards20) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards20)'];

  // 2. Find all card anchor elements (each card is an <a> containing card content)
  const cardAnchors = Array.from(element.querySelectorAll('a'));
  const rows = [];

  cardAnchors.forEach((cardAnchor) => {
    // Card image (first cell)
    let imageEl = null;
    const picture = cardAnchor.querySelector('.cmp-card__media picture');
    if (picture) {
      // Use the <img> element inside <picture>
      imageEl = picture.querySelector('img');
    }

    // Card text content (second cell)
    const textContent = document.createElement('div');
    textContent.style.display = 'flex';
    textContent.style.flexDirection = 'column';

    // Title (h3) and metadata (p)
    const titleDiv = cardAnchor.querySelector('.cmp-card__title');
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3');
      if (h3) textContent.appendChild(h3);
      const metaP = titleDiv.querySelector('p');
      if (metaP) textContent.appendChild(metaP);
    }

    // Description
    const descDiv = cardAnchor.querySelector('.cmp-card__description');
    if (descDiv) {
      // Usually contains a <p class="body-2">
      const descP = descDiv.querySelector('p');
      if (descP) textContent.appendChild(descP);
    }

    // CTA (Read More)
    const buttonDiv = cardAnchor.querySelector('.button');
    if (buttonDiv) {
      const btnText = buttonDiv.querySelector('.cmp-button__text');
      if (btnText) {
        // Wrap CTA text in a link to the cardAnchor's href
        const ctaLink = document.createElement('a');
        ctaLink.href = cardAnchor.href;
        ctaLink.target = '_blank';
        ctaLink.textContent = btnText.textContent;
        textContent.appendChild(ctaLink);
      }
    }

    rows.push([
      imageEl || '',
      textContent
    ]);
  });

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element
  element.replaceWith(table);
}
