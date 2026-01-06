/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Prepare the header row as required (single cell)
  const rows = [
    ['Accordion (accordion4)'],
  ];

  items.forEach(item => {
    // Title extraction
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

    // Content extraction
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try to find a .cmp-text (most content is here)
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        // Use all children (could be p, ul, ol, h4, etc)
        const nodes = Array.from(cmpText.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        if (nodes.length === 1) {
          content = nodes[0];
        } else if (nodes.length > 1) {
          const div = document.createElement('div');
          nodes.forEach(n => div.appendChild(n));
          content = div;
        } else {
          content = cmpText;
        }
      } else {
        // Fallback: use all children of panel
        const nodes = Array.from(panel.childNodes).filter(n => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim()));
        if (nodes.length === 1) {
          content = nodes[0];
        } else if (nodes.length > 1) {
          const div = document.createElement('div');
          nodes.forEach(n => div.appendChild(n));
          content = div;
        } else {
          content = panel;
        }
      }
    }
    rows.push([title, content]);
  });

  // Create table with header row as a single cell spanning two columns
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header row to have colspan=2
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 1) {
    headerRow.children[0].setAttribute('colspan', '2');
  }

  element.replaceWith(table);
}
