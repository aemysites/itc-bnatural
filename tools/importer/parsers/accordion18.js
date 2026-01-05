/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion18)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title: find the button with the title span
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      }
    }

    // Content: find the panel and grab all its content
    const panel = item.querySelector('.cmp-accordion__panel');
    let contentCell = '';
    if (panel) {
      // Find the deepest .cmp-text or .cmp-container inside the panel
      let contentNode = panel.querySelector('.cmp-text, .cmp-container');
      if (!contentNode) {
        // fallback: use panel's inner content
        contentNode = panel;
      }
      contentCell = contentNode;
    }

    rows.push([title, contentCell]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
