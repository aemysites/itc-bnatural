/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  const container = element.querySelector('.cmp-card__container');
  if (!container) return;

  // Each card is an <a> containing .cmp-card__content
  const cardLinks = Array.from(container.querySelectorAll('a'));

  cardLinks.forEach((cardLink) => {
    // Image/Icon: Find the first <img> inside .cmp-card__media
    const media = cardLink.querySelector('.cmp-card__media');
    let image = null;
    if (media) {
      image = media.querySelector('img');
    }

    // Text content: .cmp-card__info contains title, description, and date/category
    const info = cardLink.querySelector('.cmp-card__info');
    let textContent = document.createElement('div');
    if (info) {
      // Date/category
      const titleDiv = info.querySelector('.cmp-card__title');
      if (titleDiv) {
        // Copy all child nodes (not just <p>) to ensure all text is included
        Array.from(titleDiv.childNodes).forEach((node) => {
          textContent.appendChild(node.cloneNode(true));
        });
      }
      // Heading/title and description
      const descDiv = info.querySelector('.cmp-card__description');
      if (descDiv) {
        Array.from(descDiv.childNodes).forEach((node) => {
          textContent.appendChild(node.cloneNode(true));
        });
      }
    }
    // Add CTA link at the bottom (if present)
    // For this block, the card itself is a link, so add the link as a CTA below
    const cta = document.createElement('a');
    cta.href = cardLink.href;
    cta.target = cardLink.target || '_blank';
    cta.textContent = 'Read more';
    textContent.appendChild(cta);

    // Add the card row (image, textContent)
    rows.push([image, textContent]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
