/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block header
  const headerRow = ['Cards (cards30)'];

  // Select all card anchor elements (each card is an <a> with .cmp-card__content)
  const cardLinks = Array.from(element.querySelectorAll('a'));

  // Helper to get overlay text from image area (if present)
  function getOverlayText(card) {
    const media = card.querySelector('.cmp-card__media');
    if (!media) return null;
    // Look for overlay text: direct children that are not <picture>, and text nodes
    let overlayText = '';
    // Check for direct text nodes
    Array.from(media.childNodes)
      .filter((node) => node.nodeType === 3 && node.textContent.trim())
      .forEach((node) => {
        overlayText += node.textContent.trim() + '\n';
      });
    // Check for elements (not <picture>)
    Array.from(media.children)
      .filter((el) => el.tagName !== 'PICTURE')
      .forEach((el) => {
        overlayText += el.textContent.trim() + '\n';
      });
    return overlayText.trim() || null;
  }

  // Build card rows
  const rows = cardLinks.map((a) => {
    // Find image (inside <picture> tag)
    const img = a.querySelector('img');
    // Find card info
    const info = a.querySelector('.cmp-card__info');
    let textContent = [];
    // Overlay text (if present)
    const overlay = getOverlayText(a);
    if (overlay) {
      textContent.push(document.createTextNode(overlay));
    }
    if (info) {
      // Date/category (may be <p> inside .cmp-card__title)
      const date = info.querySelector('.cmp-card__title p');
      if (date) textContent.push(date);
      // Title (may be <h4> inside .cmp-card__description)
      const title = info.querySelector('.cmp-card__description h4');
      if (title) textContent.push(title);
    }
    return [img, textContent];
  });

  // Assemble table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
