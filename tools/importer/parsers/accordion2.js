/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all accordion items
  function getAccordionItems(root) {
    const accordion = root.querySelector('.cmp-accordion');
    if (!accordion) return [];
    return Array.from(accordion.querySelectorAll('.cmp-accordion__item'));
  }

  // Helper to extract title and content from an accordion item
  function extractItemCells(item) {
    // Title: use the .cmp-accordion__title span directly for formatting
    const titleSpan = item.querySelector('.cmp-accordion__title');
    let title = '';
    if (titleSpan) {
      title = titleSpan;
    } else {
      // Fallback: get text from button
      const btn = item.querySelector('button');
      title = btn ? document.createTextNode(btn.textContent.trim()) : document.createTextNode('');
    }

    // Content: inside [data-cmp-hook-accordion="panel"]
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let content = '';
    if (panel) {
      // Prefer .cmp-container, .text, or .cmp-text, but fallback to all children
      const contentBlocks = [];
      const preferred = panel.querySelector('.cmp-container') || panel.querySelector('.text') || panel.querySelector('.cmp-text');
      if (preferred) {
        if (preferred.classList.contains('cmp-container')) {
          const texts = preferred.querySelectorAll('.cmp-text');
          if (texts.length) {
            texts.forEach(text => contentBlocks.push(text));
          } else {
            contentBlocks.push(preferred);
          }
        } else {
          contentBlocks.push(preferred);
        }
      } else {
        Array.from(panel.children).forEach(child => {
          if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
            contentBlocks.push(child);
          }
        });
      }
      content = contentBlocks.length ? contentBlocks : [panel];
    } else {
      content = document.createTextNode('');
    }
    return [title, content];
  }

  // Compose the table
  const headerRow = ['Accordion (accordion2)'];
  const rows = [headerRow];

  // Defensive: handle multiple accordions in the same block
  let accordionRoots = element.querySelectorAll('.cmp-accordion');
  if (!accordionRoots.length) {
    accordionRoots = [element];
  }

  accordionRoots.forEach(accRoot => {
    const items = getAccordionItems(accRoot.parentNode ? accRoot.parentNode : accRoot);
    items.forEach(item => {
      rows.push(extractItemCells(item));
    });
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
