/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header: must be a single cell row
  const headerRow = ['Accordion (accordion42)'];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Build rows for each accordion item
  const rows = items.map(item => {
    // Title: find the button's title span
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan.textContent.trim() : '';

    // Content: find the panel and extract only relevant content (no wrappers)
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = document.createElement('div');
    if (panel) {
      // Find all cmp-text elements inside the panel
      const textBlocks = panel.querySelectorAll('.cmp-text');
      if (textBlocks.length) {
        textBlocks.forEach(tb => {
          Array.from(tb.childNodes).forEach(node => {
            // Only append elements that are not empty paragraphs
            if (!(node.nodeName === 'P' && !node.textContent.trim())) {
              contentCell.appendChild(node.cloneNode(true));
            }
          });
        });
      } else {
        // If no cmp-text, get all direct children except empty paragraphs
        Array.from(panel.children).forEach(child => {
          if (!(child.nodeName === 'P' && !child.textContent.trim())) {
            contentCell.appendChild(child.cloneNode(true));
          }
        });
      }
    }
    return [titleCell, contentCell];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
