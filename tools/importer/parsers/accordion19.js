/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row (single cell, must span two columns)
  const headerRow = ['Accordion (accordion19)'];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Prepare rows for each accordion item
  const rows = items.map(item => {
    // Title cell: find the button (header) and extract the title span
    const button = item.querySelector('.cmp-accordion__button');
    let titleSpan = button && button.querySelector('.cmp-accordion__title');
    let titleCell = titleSpan ? titleSpan.textContent.trim() : '';

    // Content cell: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find the first .cmp-text inside the panel (may be ul, p, etc)
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        // If cmp-text contains a UL, use it; else use all children
        const ul = textBlock.querySelector('ul');
        if (ul) {
          contentCell = ul;
        } else {
          // Use all children of cmp-text
          contentCell = Array.from(textBlock.childNodes);
        }
      } else {
        // If no cmp-text, use all children of panel
        contentCell = Array.from(panel.childNodes);
      }
    }

    return [titleCell, contentCell];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Fix header row to span two columns
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 1) {
    firstRow.children[0].setAttribute('colspan', '2');
  }

  // Replace the original element
  element.replaceWith(table);
}
