/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Find the grid containing all cards
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Select all card wrappers (teaser blocks)
  const cardDivs = grid.querySelectorAll('.teaser .cmp-teaser');

  cardDivs.forEach(cardDiv => {
    // Image cell: reference the <img> element inside the card
    const imgEl = cardDiv.querySelector('.cmp-teaser__image img');
    // Text cell: reference the description block
    const desc = cardDiv.querySelector('.cmp-teaser__description');
    if (imgEl && desc) {
      // Remove empty <p>&nbsp;</p> elements from the description
      const descClone = desc.cloneNode(true);
      descClone.querySelectorAll('p').forEach(p => {
        if (!p.textContent.trim() || p.innerHTML.trim() === '&nbsp;') {
          p.remove();
        }
      });
      // Only push the inner content, not the wrapper div
      const contentFragment = document.createDocumentFragment();
      Array.from(descClone.childNodes).forEach(node => contentFragment.appendChild(node));
      rows.push([imgEl, contentFragment]);
    }
  });

  // Defensive fallback: handle case where .teaser .cmp-teaser doesn't match (structure variation)
  if (rows.length === 1) {
    const fallbackDivs = grid.querySelectorAll('.cmp-teaser');
    fallbackDivs.forEach(cardDiv => {
      const imgEl = cardDiv.querySelector('.cmp-teaser__image img');
      const desc = cardDiv.querySelector('.cmp-teaser__description');
      if (imgEl && desc) {
        const descClone = desc.cloneNode(true);
        descClone.querySelectorAll('p').forEach(p => {
          if (!p.textContent.trim() || p.innerHTML.trim() === '&nbsp;') {
            p.remove();
          }
        });
        const contentFragment = document.createDocumentFragment();
        Array.from(descClone.childNodes).forEach(node => contentFragment.appendChild(node));
        rows.push([imgEl, contentFragment]);
      }
    });
  }

  // Only create table if at least one card is found
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
