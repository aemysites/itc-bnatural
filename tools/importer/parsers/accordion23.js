/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  if (!items.length) return;

  // Prepare table rows: header row must be single cell, but table must have two columns in all rows
  const rows = [
    ['Accordion (accordion23)'], // single cell header row
  ];

  items.forEach(item => {
    // Title extraction
    let title = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }

    // Content extraction
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      let contentElem = panel.querySelector('.cmp-text');
      if (!contentElem) {
        contentElem = Array.from(panel.children).find(
          el => el.textContent && el.textContent.trim().length > 0
        );
      }
      if (contentElem) {
        content = contentElem;
      } else if (panel.textContent && panel.textContent.trim().length > 0) {
        content = panel;
      }
    }

    // Add row to table
    rows.push([
      title,
      content
    ]);
  });

  // Create table and ensure header row is a single cell, but table has two columns in all rows
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Fix header row to span two columns for visual consistency
  const headerRow = table.querySelector('tr:first-child th, tr:first-child td');
  if (headerRow) {
    headerRow.setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
