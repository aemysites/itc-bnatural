/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion36)'];
  const rows = [headerRow];

  // Find all accordion items (each item is a section)
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title: find the button and its title span
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
    // Content: find the panel and its visible content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = null;
    if (panel) {
      // Defensive: grab all direct children of the panel
      // Usually there's a container > cmp-container > text > cmp-text
      // We'll grab the first .cmp-text inside the panel
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        // Use the cmp-text element directly for resilience
        content = cmpText;
      } else {
        // If no cmp-text, fallback to all children
        const children = Array.from(panel.children);
        content = children.length ? children : document.createTextNode('');
      }
    } else {
      content = document.createTextNode('');
    }
    // Add row: [title, content]
    rows.push([title, content]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
