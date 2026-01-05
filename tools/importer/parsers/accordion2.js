/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion2) block header
  const headerRow = ['Accordion (accordion2)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title extraction: button > .cmp-accordion__title
    let title = '';
    const button = item.querySelector('button.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }

    // Content extraction: panel > .cmp-text (all children)
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Prefer .cmp-text block if present
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        // Use all child nodes (preserve formatting, links, lists, etc)
        content = Array.from(textBlock.childNodes);
      } else {
        // If no .cmp-text, fallback to all children of panel
        content = Array.from(panel.childNodes);
      }
    }
    // Defensive: if content is empty array, use empty string
    if (Array.isArray(content) && content.length === 0) {
      content = '';
    }

    // Add row: [title, content]
    rows.push([title, content]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
