/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion header row
  const headerRow = ['Accordion (accordion18)'];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');
  const rows = [];

  items.forEach(item => {
    // Title: get the .cmp-accordion__title text
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let title = '';
    if (titleSpan) {
      title = titleSpan.textContent.trim();
    }

    // Content: get the corresponding panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Try to find the first .cmp-text inside the panel
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        // If cmpText has only one child, use it directly (ul, p, etc.)
        if (cmpText.children.length === 1) {
          content = cmpText.children[0];
        } else if (cmpText.children.length > 1) {
          // If multiple children, wrap them in a fragment
          const frag = document.createDocumentFragment();
          Array.from(cmpText.children).forEach(child => frag.appendChild(child.cloneNode(true)));
          content = frag;
        } else {
          content = cmpText;
        }
      } else {
        // Fallback: use the first child element with content
        const firstContent = panel.querySelector(':scope > *');
        content = firstContent || '';
      }
    }

    // Defensive: If content is still a string, wrap in a span
    let contentCell;
    if (typeof content === 'string') {
      const span = document.createElement('span');
      span.textContent = content;
      contentCell = span;
    } else {
      contentCell = content;
    }

    rows.push([title, contentCell]);
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
