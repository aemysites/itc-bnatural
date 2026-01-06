/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items
  function getAccordionItems(root) {
    const items = [];
    const itemNodes = root.querySelectorAll('.cmp-accordion__item');
    itemNodes.forEach(item => {
      // Title: get the button's span.cmp-accordion__title (reference the element)
      const button = item.querySelector('.cmp-accordion__button');
      let title = null;
      if (button) {
        title = button.querySelector('.cmp-accordion__title');
      }
      // Content: get the panel
      const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
      if (title && panel) {
        // Find the deepest .cmp-text or fallback to panel's main content container
        let content = null;
        // Try to find a .cmp-text inside the panel
        const textBlock = panel.querySelector('.cmp-text');
        if (textBlock) {
          content = textBlock;
        } else {
          // Fallback: use the panel's main content container if available
          const mainContainer = panel.querySelector('.cmp-container') || panel;
          content = mainContainer;
        }
        items.push([title, content]);
      }
    });
    return items;
  }

  // Build table rows
  const headerRow = ['Accordion (accordion1)'];
  const accordionItems = getAccordionItems(element);
  const rows = accordionItems.map(([title, content]) => [title, content]);
  const cells = [headerRow, ...rows];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
