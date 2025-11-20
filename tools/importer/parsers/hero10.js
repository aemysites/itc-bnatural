/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid
  const topGrid = element.querySelector('.aem-Grid');
  if (!topGrid) return;

  // Find carousel (image) and text sections
  let imageEl = null;
  let textCellContent = [];

  // Find all direct grid children
  const gridChildren = topGrid.querySelectorAll(':scope > div');
  gridChildren.forEach((child) => {
    // Find carousel block (contains image)
    if (child.classList.contains('carousel')) {
      // Find image inside carousel
      const img = child.querySelector('img');
      if (img) imageEl = img;
    }
    // Find text block
    if (child.classList.contains('text')) {
      const cmpText = child.querySelector('.cmp-text');
      if (cmpText) {
        // Extract all text content, including headings and paragraphs
        cmpText.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((node) => {
          const txt = node.textContent.trim();
          if (txt && txt !== '\u00A0') {
            textCellContent.push(node.cloneNode(true));
          }
        });
      }
    }
  });

  // Ensure all text content from the source html is included (for flexibility)
  // If any text content is missing, supplement from the whole element
  const allTextNodes = [];
  element.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((node) => {
    const txt = node.textContent.trim();
    if (txt && txt !== '\u00A0') {
      allTextNodes.push(node.cloneNode(true));
    }
  });
  // Use all text nodes if they contain more content than what we have
  if (allTextNodes.length > textCellContent.length) {
    textCellContent = allTextNodes;
  }

  // Build table rows
  const headerRow = ['Hero (hero10)'];
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textCellContent.length ? textCellContent : ''];

  // Compose table
  const cells = [headerRow, imageRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
