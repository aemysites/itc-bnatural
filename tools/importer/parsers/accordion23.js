/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Find the accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Find all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');
  items.forEach(item => {
    // Title cell: find the button and extract the title span
    const button = item.querySelector('button.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }
    // Content cell: preserve all visible content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Find the innermost .cmp-text or direct content containers
      const textBlocks = panel.querySelectorAll('.cmp-text');
      const frag = document.createDocumentFragment();
      if (textBlocks.length) {
        textBlocks.forEach(tb => {
          // Append all children (ul, ol, p, etc) in order
          Array.from(tb.children).forEach(child => {
            frag.appendChild(child.cloneNode(true));
          });
        });
      } else {
        // Fallback: append all direct children of panel
        Array.from(panel.children).forEach(child => {
          frag.appendChild(child.cloneNode(true));
        });
      }
      // If nothing was added, fallback to panel text
      if (!frag.childNodes.length && panel.textContent.trim()) {
        frag.appendChild(document.createTextNode(panel.textContent.trim()));
      }
      contentCell = frag.childNodes.length ? frag : '';
    }
    rows.push([title, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
