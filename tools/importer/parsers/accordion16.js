/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Accordion (accordion16)'];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Build rows for each accordion item
  const rows = items.map(item => {
    // Title: find the button and its title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content: find the panel and its inner content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Defensive: grab all children of the panel
      // If there's a single container, use its children
      const containers = panel.querySelectorAll(':scope > .container, :scope > div');
      if (containers.length === 1) {
        content = containers[0];
      } else if (containers.length > 1) {
        content = Array.from(containers);
      } else {
        // Fallback: use panel itself
        content = panel;
      }
    }
    // Title cell: create a paragraph for the title
    const titleEl = document.createElement('p');
    titleEl.textContent = title;
    titleEl.style.fontWeight = 'bold';
    return [titleEl, content];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
