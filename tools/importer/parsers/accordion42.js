/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion42)'];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Prepare rows for each accordion item
  const rows = items.map(item => {
    // Title: Find the button and extract the title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }

    // Content: Find the panel and extract its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Defensive: If the panel contains a single container, use its children
      // Otherwise, use all children of the panel
      let contentElements = [];
      // Find the deepest content container
      let contentContainer = panel;
      // Drill down through containers if present
      while (
        contentContainer.children.length === 1 &&
        contentContainer.firstElementChild.classList.contains('container')
      ) {
        contentContainer = contentContainer.firstElementChild;
      }
      // Now, find the actual content elements
      // If there's a grid, drill into it
      const grid = contentContainer.querySelector('.aem-Grid');
      if (grid) {
        contentElements = Array.from(grid.children);
      } else {
        // Otherwise, use all direct children
        contentElements = Array.from(contentContainer.children);
      }
      // If still empty, fallback to all children of panel
      if (contentElements.length === 0) {
        contentElements = Array.from(panel.children);
      }
      // If still empty, fallback to panel itself
      if (contentElements.length === 0) {
        contentElements = [panel];
      }
      content = contentElements;
    }

    // Defensive: If content is a string, wrap in array
    if (typeof content === 'string') {
      content = [document.createTextNode(content)];
    }

    // Return row: [title, content]
    return [title, content];
  });

  // Compose final table data
  const tableData = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace original element
  element.replaceWith(block);
}
