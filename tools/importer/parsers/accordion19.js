/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion19)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title: find the button and its title span
    let title = '';
    const button = item.querySelector('button.cmp-accordion__button');
    if (button) {
      const titleSpan = button.querySelector('.cmp-accordion__title');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        title = button.textContent.trim();
      }
    }

    // Content: find the panel and extract only the relevant content (not all container divs)
    let content = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Look for direct text, <ul>, <ol>, <p>, or .cmp-text inside the panel
      let found = panel.querySelector('.cmp-text');
      if (found) {
        // Use only the children of .cmp-text (usually <ul> or <p>)
        if (found.children.length === 1) {
          content = found.children[0];
        } else if (found.children.length > 1) {
          content = Array.from(found.children);
        } else {
          content = found;
        }
      } else {
        // Fallback: look for <ul>, <ol>, <p> directly inside panel
        const directContent = panel.querySelector('ul, ol, p');
        if (directContent) {
          content = directContent;
        } else {
          // Fallback: use panel's textContent if nothing else found
          content = panel.textContent.trim();
        }
      }
    }

    // Push row: title (string), content (element or array)
    rows.push([title, content]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
