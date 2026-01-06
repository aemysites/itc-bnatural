/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards22) block header
  const headerRow = ['Cards (cards22)'];
  const rows = [headerRow];

  // Find all card anchors (each card is an <a> with .cmp-card__content inside)
  const cardLinks = element.querySelectorAll('.cmp-card__container > a');

  cardLinks.forEach((cardLink) => {
    const cardContent = cardLink.querySelector('.cmp-card__content');
    if (!cardContent) return;

    // Image (first cell)
    const media = cardContent.querySelector('.cmp-card__media picture, .cmp-card__media img');
    let imageEl = null;
    if (media) {
      // Prefer <picture> if present, else <img>
      imageEl = media.tagName === 'PICTURE' ? media : media.querySelector('img');
    }
    // Defensive: fallback to any img inside cardContent
    if (!imageEl) imageEl = cardContent.querySelector('img');

    // Text (second cell): Only the title (h3)
    const title = cardContent.querySelector('.cmp-card__title h3');
    let textContent = '';
    if (title) {
      textContent = title.outerHTML;
    }
    // Create a container for the text cell
    const textDiv = document.createElement('div');
    if (textContent) textDiv.innerHTML = textContent;

    rows.push([
      imageEl || '',
      textDiv
    ]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
