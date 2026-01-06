/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers
  const cardNodes = element.querySelectorAll('.cmp-teaser');

  // Table header row
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  cardNodes.forEach(card => {
    // Image cell: use the actual <img> element from the DOM
    const img = card.querySelector('.cmp-teaser__image img');
    const imageCell = img || '';

    // Text cell: extract only the inner content (no wrapper div, no empty paragraphs)
    const desc = card.querySelector('.cmp-teaser__description');
    let textCell = '';
    if (desc) {
      // Clone and clean: remove empty paragraphs and &nbsp;
      const clone = desc.cloneNode(true);
      // Remove all <p> that are empty or only contain &nbsp;
      clone.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim() || p.innerHTML.trim() === '&nbsp;') {
          p.remove();
        }
      });
      // Remove &nbsp; from list items
      clone.querySelectorAll('li').forEach(li => {
        li.innerHTML = li.innerHTML.replace(/&nbsp;/g, '');
      });
      // Unwrap: use only the children of the description div
      textCell = Array.from(clone.childNodes);
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table using DOMUtils
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
