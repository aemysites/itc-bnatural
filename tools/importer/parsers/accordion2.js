/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion2)'];
  const rows = [headerRow];

  // Find the main accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach((item) => {
    // Title: find the button with the title span
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }
    // Content: find the panel
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Drill down through single-child containers to get to the actual content
      let contentEl = panel;
      while (
        contentEl.children.length === 1 &&
        !contentEl.querySelector('.cmp-text, p, ul, ol, img, table') &&
        contentEl.children[0]
      ) {
        contentEl = contentEl.children[0];
      }
      // Now, look for the actual content block
      const textBlock = contentEl.querySelector('.cmp-text') || contentEl;
      // If .cmp-text exists, use its children; otherwise, use all children
      const contentNodes = textBlock.classList && textBlock.classList.contains('cmp-text')
        ? Array.from(textBlock.childNodes)
        : Array.from(textBlock.childNodes);
      // Filter out empty text nodes
      const filteredNodes = contentNodes.filter(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent.trim() !== '';
        }
        return true;
      });
      // If only one node, use it directly; otherwise, use array
      content = filteredNodes.length === 1 ? filteredNodes[0] : filteredNodes;
    }
    rows.push([title, content]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
