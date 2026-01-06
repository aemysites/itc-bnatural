/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header: single cell, per guidelines
  const headerRow = ['Accordion (accordion36)'];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Prepare rows for each accordion item
  const rows = items.map(item => {
    // Title: find the button and get its text
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content: find the panel and extract its main content container
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Defensive: grab the first .container or .cmp-container or .cmp-text inside panel
      let mainContent = panel.querySelector('.container, .cmp-container, .cmp-text');
      if (!mainContent) {
        // fallback: get all children
        mainContent = document.createElement('div');
        Array.from(panel.children).forEach(child => mainContent.appendChild(child.cloneNode(true)));
      }
      content = mainContent;
    }
    // Title cell (string), Content cell (element)
    return [title, content];
  });

  // Build the table with header as a single cell row
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
