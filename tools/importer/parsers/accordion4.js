/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion4) block parsing
  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Header row must match block name exactly
  const headerRow = ['Accordion (accordion4)'];
  const rows = [headerRow];

  items.forEach(item => {
    // Title cell: find the button, then the title span inside it
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

    // Content cell: find the panel and extract its content
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Find all .cmp-text descendants inside the panel
      const textBlocks = Array.from(panel.querySelectorAll('.cmp-text'));
      if (textBlocks.length > 0) {
        // If multiple text blocks, include all as references
        content = textBlocks.map(tb => tb);
      } else {
        // If no .cmp-text, fallback to panel's children
        const panelChildren = Array.from(panel.children);
        if (panelChildren.length > 0) {
          content = panelChildren;
        } else {
          content = '';
        }
      }
    }
    rows.push([title, content]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
