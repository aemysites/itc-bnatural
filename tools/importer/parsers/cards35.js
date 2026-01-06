/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards35) block header
  const headerRow = ['Cards (cards35)'];

  // Find all card content blocks
  const cardEls = element.querySelectorAll('.cmp-card__content');
  const rows = [];

  cardEls.forEach(cardEl => {
    // Image: find the img inside .cmp-card__media
    const media = cardEl.querySelector('.cmp-card__media img');
    let imgEl = null;
    if (media) {
      imgEl = media;
    }

    // Text content: include all visible text from .cmp-card__info
    const info = cardEl.querySelector('.cmp-card__info');
    let textContent = document.createElement('div');
    if (info) {
      // Clone all children to preserve all text and structure
      Array.from(info.children).forEach(child => {
        textContent.appendChild(child.cloneNode(true));
      });
    }
    // Link: use the card's main anchor
    const link = cardEl.querySelector('a[href]');
    if (link) {
      // Add a CTA link at the bottom (using the card title as text if possible)
      const title = info && info.querySelector('.cmp-card__title h4');
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = title ? title.textContent.trim() : link.href;
      cta.target = '_self';
      textContent.appendChild(cta);
    }
    rows.push([imgEl, textContent]);
  });

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
