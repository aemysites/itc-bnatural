/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards17) block parsing
  // Header row as per block guidelines
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Find all card anchor elements (each card is wrapped in <a>)
  const cardAnchors = element.querySelectorAll('a');

  cardAnchors.forEach((cardAnchor) => {
    // Find the card content container
    const cardContent = cardAnchor.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // --- IMAGE CELL ---
    // Find the image inside the card
    let imageEl = null;
    const media = cardContent.querySelector('.cmp-card__media');
    if (media) {
      // Prefer <img> inside <picture>
      const img = media.querySelector('img');
      if (img) imageEl = img;
      else {
        // Fallback: use <picture> if no <img>
        const picture = media.querySelector('picture');
        if (picture) imageEl = picture;
      }
    }

    // --- TEXT CELL ---
    // Find the card title (h3)
    let titleEl = null;
    const titleDiv = cardContent.querySelector('.cmp-card__title');
    if (titleDiv) {
      const h3 = titleDiv.querySelector('h3');
      if (h3) titleEl = h3;
      else titleEl = titleDiv;
    }

    // Compose the text cell
    const textCellContent = [];
    if (titleEl) textCellContent.push(titleEl);
    // No description or CTA in this source, but if present, add here

    // Add row: [image, text]
    rows.push([
      imageEl,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
