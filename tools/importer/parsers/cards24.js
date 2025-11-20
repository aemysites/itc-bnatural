/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block: extract each card's image and text content
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find the card container (should be .cmp-card__container)
  const cardContainer = element.querySelector('.cmp-card__container');
  if (!cardContainer) return;

  // Try to find the decorative heading inside the element (not just siblings)
  // Look for a heading or styled text node above the card container
  let decorativeHeading = null;
  // Search for a div or heading element with significant text before the card container
  for (const node of element.childNodes) {
    if (node === cardContainer) break;
    if (node.nodeType === 1 && node.textContent.trim().length > 0) {
      // Element node with content
      decorativeHeading = node.cloneNode(true);
    } else if (node.nodeType === 3 && node.textContent.trim().length > 0) {
      // Text node with content
      const headingEl = document.createElement('div');
      headingEl.textContent = node.textContent.trim();
      decorativeHeading = headingEl;
    }
  }

  // Each card is an <a> containing .cmp-card__content
  const cardLinks = cardContainer.querySelectorAll('a');
  cardLinks.forEach((cardLink, idx) => {
    const cardContent = cardLink.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // Image: .cmp-card__media picture > img
    const media = cardContent.querySelector('.cmp-card__media picture img');
    let imageEl = null;
    if (media) {
      imageEl = media.cloneNode(true);
    }

    // Text content: .cmp-card__info
    const info = cardContent.querySelector('.cmp-card__info');
    let textContent = document.createElement('div');
    // For the first card, prepend the decorative heading if present
    if (idx === 0 && decorativeHeading) {
      textContent.appendChild(decorativeHeading.cloneNode(true));
    }
    if (info) {
      // Date/category: .cmp-card__title > p.body-2
      const dateCat = info.querySelector('.cmp-card__title p');
      if (dateCat) {
        textContent.appendChild(dateCat.cloneNode(true));
      }
      // Title: .cmp-card__description > h4
      const desc = info.querySelector('.cmp-card__description h4');
      if (desc) {
        textContent.appendChild(desc.cloneNode(true));
      }
    }
    // Do NOT add extra CTA link
    rows.push([imageEl, textContent]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
