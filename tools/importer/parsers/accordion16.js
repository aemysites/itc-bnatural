/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion16)'];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  const rows = [headerRow];

  items.forEach(item => {
    // Title cell: get the button title text (not the icon)
    const button = item.querySelector('.cmp-accordion__button');
    let titleSpan = button && button.querySelector('.cmp-accordion__title');
    // Defensive fallback if structure changes
    let titleContent = titleSpan ? titleSpan.textContent.trim() : (button ? button.textContent.trim() : '');
    const titleCell = document.createElement('div');
    titleCell.textContent = titleContent;
    titleCell.style.fontWeight = 'bold';

    // Content cell: find the panel and extract its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: find first .cmp-text or all direct children
      const cmpText = panel.querySelector('.cmp-text');
      if (cmpText) {
        contentCell = cmpText;
      } else {
        // If no .cmp-text, use panel's children
        const panelChildren = Array.from(panel.children);
        if (panelChildren.length) {
          contentCell = document.createElement('div');
          panelChildren.forEach(child => contentCell.appendChild(child.cloneNode(true)));
        } else {
          contentCell = document.createElement('div');
          contentCell.innerHTML = panel.innerHTML;
        }
      }
    } else {
      // If no panel, leave cell blank
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
