/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block header
  const headerRow = ['Cards (cards20)'];

  // Find all card anchor elements (each card is wrapped in an <a>)
  const cardAnchors = Array.from(element.querySelectorAll('.cmp-card__container > a'));

  // For each card, extract image and text content
  const rows = cardAnchors.map(card => {
    // Image: find the <img> inside .cmp-card__media
    const img = card.querySelector('.cmp-card__media img');

    // Text content: title, subtitle, description, CTA
    const titleBlock = card.querySelector('.cmp-card__title');
    const descriptionBlock = card.querySelector('.cmp-card__description');
    const buttonText = card.querySelector('.cmp-button__text');
    const cardLink = card.getAttribute('href');

    // Build the text cell
    const textCell = document.createElement('div');
    // Title (h3 + p)
    if (titleBlock) {
      Array.from(titleBlock.children).forEach(child => textCell.appendChild(child.cloneNode(true)));
    }
    // Description
    if (descriptionBlock) {
      Array.from(descriptionBlock.children).forEach(child => textCell.appendChild(child.cloneNode(true)));
    }
    // CTA (Read More)
    if (buttonText && cardLink) {
      const cta = document.createElement('a');
      cta.href = cardLink;
      cta.textContent = buttonText.textContent;
      cta.setAttribute('target', '_blank');
      textCell.appendChild(cta);
    }

    return [img, textCell];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
