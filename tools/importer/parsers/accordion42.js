/* global WebImporter */
export default function parse(element, { document }) {
  // Get all accordion items
  const items = Array.from(element.querySelectorAll('.cmp-accordion__item'));

  // Header row: block name only
  const headerRow = ['Accordion (accordion42)'];
  const rows = [headerRow];

  items.forEach(item => {
    // Title: find the button, then the span with the title
    let title = '';
    const button = item.querySelector('button.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      title = titleSpan ? titleSpan.textContent.trim() : button.textContent.trim();
    }

    // Content: find the panel, then extract only the inner content
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Find the innermost .cmp-text or direct content block
      const textBlock = panel.querySelector('.cmp-text');
      if (textBlock) {
        // Collect all <ul>, <ol>, <p>, <h2> in cmp-text
        const mainContents = textBlock.querySelectorAll('ul, ol, p, h2');
        if (mainContents.length > 0) {
          const frag = document.createDocumentFragment();
          mainContents.forEach(node => frag.appendChild(node.cloneNode(true)));
          content = frag;
        } else {
          // Fallback: use all children of cmp-text
          const frag = document.createDocumentFragment();
          Array.from(textBlock.childNodes).forEach(child => frag.appendChild(child.cloneNode(true)));
          content = frag;
        }
      } else {
        // Fallback: find all <ul>, <ol>, <p>, <h2> in panel
        const mainContents = panel.querySelectorAll('ul, ol, p, h2');
        if (mainContents.length > 0) {
          const frag = document.createDocumentFragment();
          mainContents.forEach(node => frag.appendChild(node.cloneNode(true)));
          content = frag;
        } else {
          // Fallback: use panel itself
          content = panel;
        }
      }
    }

    rows.push([title, content]);
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
