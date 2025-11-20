/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the decorative heading if present
  let headingEl = null;
  const possibleHeading = Array.from(element.querySelectorAll('*')).find(el => el.textContent && el.textContent.trim().match(/Goodness of Fruit.*Fiber/i));
  if (possibleHeading) {
    headingEl = document.createElement('h2');
    headingEl.textContent = possibleHeading.textContent.trim();
  }

  // Cards (cards35) block: 2 columns, each row is a card (image | text)
  const headerRow = ['Cards (cards35)'];
  const rows = [headerRow];

  // Find all card content blocks (each card is a .cmp-card__content)
  const cardNodes = element.querySelectorAll('.cmp-card__content');

  cardNodes.forEach((card) => {
    // Image cell extraction
    let imageEl = null;
    const media = card.querySelector('.cmp-card__media');
    if (media) {
      const img = media.querySelector('img');
      if (img) {
        imageEl = img;
      } else {
        const picture = media.querySelector('picture');
        if (picture) imageEl = picture;
      }
    }

    // Text cell extraction
    const info = card.querySelector('.cmp-card__info');
    const textParts = [];
    if (info) {
      // Date and type (metadata)
      const dateDiv = info.querySelector('.cmp-card__date');
      if (dateDiv) {
        const metaSpan = document.createElement('div');
        metaSpan.style.fontSize = 'smaller';
        Array.from(dateDiv.children).forEach((span, idx, arr) => {
          metaSpan.appendChild(span.cloneNode(true));
          if (idx < arr.length - 1) {
            metaSpan.appendChild(document.createTextNode(' | '));
          }
        });
        textParts.push(metaSpan);
      }
      // Title
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        const h4 = titleDiv.querySelector('h4');
        if (h4) {
          textParts.push(h4.cloneNode(true));
        }
      }
    }
    // Description extraction (if any extra text nodes)
    if (info) {
      Array.from(info.childNodes).forEach((node) => {
        if (
          node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== ''
        ) {
          textParts.push(document.createTextNode(node.textContent.trim()));
        }
        if (
          node.nodeType === Node.ELEMENT_NODE &&
          !node.classList.contains('cmp-card__date') &&
          !node.classList.contains('cmp-card__title') &&
          node.textContent.trim() !== ''
        ) {
          textParts.push(document.createTextNode(node.textContent.trim()));
        }
      });
    }
    // Link (CTA) - only if the link has meaningful text in the source
    const link = card.querySelector('a[href]');
    if (link && link.textContent && link.textContent.trim() !== '') {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = link.textContent.trim();
      textParts.push(cta);
    }
    rows.push([
      imageEl,
      textParts,
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  if (headingEl) {
    element.replaceWith(headingEl, block);
  } else {
    element.replaceWith(block);
  }
}
