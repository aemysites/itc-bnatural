/* global WebImporter */

export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Cards (cards20)'];
  const rows = [headerRow];

  // Find all card anchor wrappers (each <a> is a card)
  const cardLinks = element.querySelectorAll('a');

  cardLinks.forEach((cardLink) => {
    // Find image (in <picture> or <img>)
    let imgEl = cardLink.querySelector('picture img');
    // Defensive: if no <img> in <picture>, try any <img>
    if (!imgEl) imgEl = cardLink.querySelector('img');

    // Build text content (title, subtitle, description, CTA)
    const contentFrag = document.createDocumentFragment();

    // Title (h3)
    const title = cardLink.querySelector('.cmp-card__title h3');
    if (title) {
      const h3 = document.createElement('h3');
      h3.innerHTML = title.innerHTML;
      contentFrag.appendChild(h3);
    }
    // Subtitle (date/source, in <p> after h3)
    const subtitle = cardLink.querySelector('.cmp-card__title p');
    if (subtitle) {
      const sub = document.createElement('p');
      sub.innerHTML = subtitle.innerHTML;
      contentFrag.appendChild(sub);
    }
    // Description
    const desc = cardLink.querySelector('.cmp-card__description p');
    if (desc) {
      const descP = document.createElement('p');
      descP.innerHTML = desc.innerHTML;
      contentFrag.appendChild(descP);
    }
    // CTA (Read More) - use the cardLink's href
    const ctaText = cardLink.querySelector('.cmp-button__text');
    if (ctaText && cardLink.href) {
      const ctaLink = document.createElement('a');
      ctaLink.href = cardLink.href;
      ctaLink.target = '_blank';
      ctaLink.textContent = ctaText.textContent;
      contentFrag.appendChild(document.createElement('br'));
      contentFrag.appendChild(ctaLink);
    }

    // Add row: [image, text content]
    rows.push([
      imgEl || '',
      contentFrag
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
