/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion16)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  items.forEach(item => {
    // Title: Find the button with class 'cmp-accordion__button' and get its text (from span.cmp-accordion__title)
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Place title in a strong tag for semantic emphasis
    const titleElem = document.createElement('strong');
    titleElem.textContent = title;

    // Content: Find the panel with data-cmp-hook-accordion="panel"
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentElem = document.createElement('div');
    if (panel) {
      // Find the first content container inside the panel
      const contentContainer = panel.querySelector('.cmp-container');
      if (contentContainer) {
        // Use the container directly for resilience
        contentElem = contentContainer;
      } else {
        // Fallback: use panel itself
        contentElem = panel;
      }
    }

    rows.push([titleElem, contentElem]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
