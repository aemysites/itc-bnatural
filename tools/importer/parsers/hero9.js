/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the image (background)
  function findHeroImage(el) {
    const img = el.querySelector('.cmp-teaser__image img');
    return img || '';
  }

  // Extract all non-empty children from .cmp-teaser__description
  // Promote first non-empty paragraph to heading ONLY if no heading exists
  function extractTextWithHeading(el) {
    const desc = el.querySelector('.cmp-teaser__description');
    if (!desc) return [];
    const children = Array.from(desc.children).filter(child => child.textContent.trim());
    if (!children.length) return [];
    // Check if any heading exists
    const hasHeading = children.some(child => /^H[1-3]$/.test(child.tagName));
    if (!hasHeading) {
      // Promote first non-empty paragraph to heading
      if (children[0].tagName === 'P') {
        const h = document.createElement('h1');
        h.textContent = children[0].textContent;
        children[0] = h;
      }
    }
    return children;
  }

  const headerRow = ['Hero (hero9)'];
  const image = findHeroImage(element);
  const textContent = extractTextWithHeading(element);

  const rows = [
    headerRow,
    [image ? image : ''],
    [textContent.length ? textContent : '']
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
