/* global WebImporter */
export default function parse(element, { document }) {
  // Build header row as required
  const headerRow = ['Accordion (accordion4)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));
  items.forEach(item => {
    // Title: find the button with class 'cmp-accordion__button', then get the span.cmp-accordion__title
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content: find the panel (div[data-cmp-hook-accordion="panel"])
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      const container = panel.querySelector('.container');
      if (container) {
        content = container;
      } else {
        content = panel;
      }
    }
    rows.push([title, content]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
