/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion1)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title: find the button with the title span
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }

    // Content: find the corresponding panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Defensive: find the first container with actual content
      // (skip empty wrappers)
      let contentNode = null;
      // Look for a .cmp-text inside the panel
      contentNode = panel.querySelector('.cmp-text');
      if (!contentNode) {
        // Fallback: use the panel itself
        contentNode = panel;
      }
      // Defensive: clone the content node so we don't move it from the DOM
      content = contentNode.cloneNode(true);
    }

    // Build the row: title (as text), content (as element)
    rows.push([title, content]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
