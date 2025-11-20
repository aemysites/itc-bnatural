/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion1)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title: find the button with the title span
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Defensive: get all direct children of the panel
      // Usually a .container > .cmp-container > .aem-Grid > content
      // We'll grab the first .aem-Grid inside the panel
      const grid = panel.querySelector('.aem-Grid');
      if (grid) {
        // Use the grid and its contents as the cell value
        content = grid;
      } else {
        // Fallback: use panel itself
        content = panel;
      }
    }
    // Create row: [title, content]
    rows.push([title, content]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
