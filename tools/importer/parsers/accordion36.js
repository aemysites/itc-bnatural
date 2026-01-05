/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header (must be a single cell)
  const headerRow = ['Accordion (accordion36)'];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  // Each row: [title, content]
  const rows = [headerRow];

  items.forEach((item) => {
    // Title: find the button and its title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }

    // Content: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = null;
    if (panel) {
      // Defensive: get the first content container inside the panel
      const contentContainer = panel.querySelector('.cmp-container, .container');
      content = contentContainer || panel;
    }

    // Only push rows that have both title and content
    if (title && content) {
      rows.push([title, content]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Fix header row to have only one cell (remove extra columns)
  if (block.querySelector('tr')) {
    const headerTr = block.querySelector('tr');
    // Remove all but the first cell in header row
    while (headerTr.cells.length > 1) {
      headerTr.deleteCell(1);
    }
  }

  // Replace the original element
  element.replaceWith(block);
}
