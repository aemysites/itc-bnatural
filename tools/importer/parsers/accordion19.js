/* global WebImporter */
export default function parse(element, { document }) {
  // Create header row: single cell, but set colspan=2
  const headerRow = [document.createElement('th')];
  headerRow[0].textContent = 'Accordion (accordion19)';
  headerRow[0].setAttribute('colspan', '2');

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Prepare rows for each accordion item
  const rows = items.map(item => {
    // Title: find the button and extract the title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content: find the panel and grab its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      const contentContainer = panel.querySelector('.cmp-container');
      if (contentContainer) {
        const textBlocks = Array.from(contentContainer.querySelectorAll('.cmp-text'));
        if (textBlocks.length === 1) {
          content = textBlocks[0];
        } else if (textBlocks.length > 1) {
          const wrapper = document.createElement('div');
          textBlocks.forEach(tb => wrapper.appendChild(tb));
          content = wrapper;
        } else {
          content = contentContainer;
        }
      } else {
        content = panel;
      }
    }
    return [title, content];
  });

  // Build table manually to ensure correct header row
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  trHead.appendChild(headerRow[0]);
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      if (typeof cell === 'string') {
        td.textContent = cell;
      } else if (cell instanceof Element) {
        td.appendChild(cell);
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Replace original element
  element.replaceWith(table);
}
