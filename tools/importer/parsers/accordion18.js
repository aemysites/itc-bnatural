/* global WebImporter */
export default function parse(element, { document }) {
  // Build rows for the table
  const rows = [];

  // Header row: must be a single cell with colspan=2
  const headerRow = document.createElement('tr');
  const th = document.createElement('th');
  th.setAttribute('colspan', '2');
  th.textContent = 'Accordion (accordion18)';
  headerRow.appendChild(th);
  rows.push(headerRow);

  // Select all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: find the button, then the span with the title
    const button = item.querySelector('button.cmp-accordion__button');
    let titleText = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        titleText = titleSpan.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }
    // Create a strong element for the title (matches screenshot bold)
    const titleEl = document.createElement('strong');
    titleEl.textContent = titleText;

    // Content cell: find the panel and its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell;
    if (panel) {
      // Defensive: get all direct content containers inside the panel
      let contentBlocks = [];
      const containers = panel.querySelectorAll('.cmp-container, .container');
      if (containers.length) {
        // Only add each .cmp-text ONCE per cell
        containers.forEach((container) => {
          const texts = container.querySelectorAll('.cmp-text');
          if (texts.length) {
            texts.forEach((text) => {
              contentBlocks.push(text);
            });
          } else {
            contentBlocks.push(container);
          }
        });
      } else {
        Array.from(panel.children).forEach((child) => {
          contentBlocks.push(child);
        });
      }
      // Remove duplicates from contentBlocks
      const uniqueBlocks = [];
      const seen = new Set();
      contentBlocks.forEach((block) => {
        if (!seen.has(block)) {
          uniqueBlocks.push(block);
          seen.add(block);
        }
      });
      contentCell = uniqueBlocks.length === 1 ? uniqueBlocks[0] : uniqueBlocks;
    } else {
      contentCell = '';
    }

    // Build row as <tr><td>title</td><td>content</td></tr>
    const row = document.createElement('tr');
    const tdTitle = document.createElement('td');
    tdTitle.appendChild(titleEl);
    const tdContent = document.createElement('td');
    if (Array.isArray(contentCell)) {
      contentCell.forEach((el) => tdContent.appendChild(el.cloneNode(true)));
    } else if (contentCell instanceof Element) {
      tdContent.appendChild(contentCell.cloneNode(true));
    } else if (typeof contentCell === 'string') {
      tdContent.textContent = contentCell;
    }
    row.appendChild(tdTitle);
    row.appendChild(tdContent);
    rows.push(row);
  });

  // Build the table
  const table = document.createElement('table');
  rows.forEach((row) => table.appendChild(row));
  element.replaceWith(table);
}
