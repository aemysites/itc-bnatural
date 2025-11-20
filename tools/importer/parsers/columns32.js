/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main teaser block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // LEFT COLUMN: Text content and CTA
  const content = teaser.querySelector('.cmp-teaser__content');
  const leftCol = document.createElement('div');
  if (content) {
    // Title (red, h3)
    const title = content.querySelector('.cmp-teaser__title');
    if (title) leftCol.appendChild(title);
    // Description (h1)
    const desc = content.querySelector('.cmp-teaser__description');
    if (desc) {
      // Some descriptions wrap an h1, preserve hierarchy
      Array.from(desc.childNodes).forEach(node => leftCol.appendChild(node.cloneNode(true)));
    }
    // CTA button
    const cta = content.querySelector('.cmp-teaser__action-link');
    if (cta) leftCol.appendChild(cta);
  }

  // RIGHT COLUMN: Main image and animation image
  const rightCol = document.createElement('div');
  // Main image (farm scene)
  const mainImg = teaser.querySelector('.cmp-teaser__image img');
  if (mainImg) rightCol.appendChild(mainImg);
  // Animation image (guava)
  const animImg = teaser.querySelector('.cmp-animation img');
  if (animImg) rightCol.appendChild(animImg);

  // Compose table
  const headerRow = ['Columns (columns32)'];
  const columnsRow = [leftCol, rightCol];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
