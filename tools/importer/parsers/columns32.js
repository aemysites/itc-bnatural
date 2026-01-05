/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Left column: text and button
  const leftCol = document.createElement('div');
  const teaserContent = teaser.querySelector('.cmp-teaser__content');
  if (teaserContent) {
    // Move all content children (h3, h1)
    Array.from(teaserContent.children).forEach(child => {
      leftCol.appendChild(child.cloneNode(true));
    });
  }
  // Add the button (if any), but only once and not duplicating
  const actionContainer = teaser.querySelector('.cmp-teaser__action-container');
  if (actionContainer) {
    const btn = actionContainer.querySelector('a');
    if (btn && !leftCol.querySelector('a')) leftCol.appendChild(btn.cloneNode(true));
  }

  // Right column: main image(s)
  const rightCol = document.createElement('div');
  // Main farm image
  const farmImagePicture = teaser.querySelector('.cmp-teaser__image picture');
  if (farmImagePicture) {
    rightCol.appendChild(farmImagePicture.cloneNode(true));
  }
  // Decorative guava image
  const guavaPicture = teaser.querySelector('.cmp-animation picture');
  if (guavaPicture) {
    rightCol.appendChild(guavaPicture.cloneNode(true));
  }

  // Compose table
  const headerRow = ['Columns (columns32)'];
  const contentRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
