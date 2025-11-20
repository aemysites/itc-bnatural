/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header (single cell, must span two columns)
  const headerRow = ['Accordion (accordion23)'];

  // Find the accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  if (!items.length) return;

  // Prepare rows for the block table
  const rows = [];

  // Add header row as a single cell spanning two columns
  const header = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = headerRow[0];
  th.colSpan = 2;
  header.appendChild(th);
  rows.push(header);

  items.forEach((item) => {
    // Title: get the button text inside the header
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }

    // Content: get the panel content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = document.createElement('td');
    if (panel) {
      // Flatten the content: extract only the actual content inside the panel
      // Find the innermost .cmp-text or use panel's children
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        Array.from(textBlock.childNodes).forEach((node) => {
          contentCell.appendChild(node.cloneNode(true));
        });
      } else {
        Array.from(panel.childNodes).forEach((node) => {
          contentCell.appendChild(node.cloneNode(true));
        });
      }
    }

    // Title cell
    const titleCell = document.createElement('td');
    titleCell.textContent = title;

    // Row
    const row = document.createElement('tr');
    row.appendChild(titleCell);
    row.appendChild(contentCell);
    rows.push(row);
  });

  // Build table manually to ensure correct structure
  const table = document.createElement('table');
  rows.forEach((row) => table.appendChild(row));

  // Replace the original element
  element.replaceWith(table);
}
