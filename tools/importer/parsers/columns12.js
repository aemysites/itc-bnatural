/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get the logo column (leftmost), including all text content
  const logoCol = (() => {
    const navLogo = element.querySelector('.cmp-footer__nav-logo');
    if (!navLogo) return '';
    // Prefer desktop, fallback to mobile
    const desktopDiv = navLogo.querySelector('.bnatural-footer-desktop-div');
    const mobileDiv = navLogo.querySelector('.bnatural-footer-mobile-div');
    const logoDiv = desktopDiv || mobileDiv;
    if (!logoDiv) return '';
    // Find the certification/license text under the logos
    // It is in the parent .bnatural-footer-div, as text nodes or spans
    const parentDiv = logoDiv.closest('.bnatural-footer-div');
    const colDiv = document.createElement('div');
    colDiv.appendChild(logoDiv.cloneNode(true));
    if (parentDiv) {
      // Find all elements or text nodes (excluding logoDiv) with visible text
      Array.from(parentDiv.childNodes).forEach(n => {
        if (n === logoDiv) return;
        // Only include elements that are not divs (to avoid logoDiv and mobileDiv)
        if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== 'DIV' && n.textContent.trim()) {
          colDiv.appendChild(n.cloneNode(true));
        }
        // Also include text nodes
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = n.textContent.trim();
          colDiv.appendChild(span);
        }
      });
    }
    return colDiv;
  })();

  // Helper: Get navigation columns (3 columns)
  const navCols = (() => {
    const navContainer = element.querySelector('.cmp-footer__nav');
    if (!navContainer) return [];
    // Only visible navigation groups (display: block)
    const navGroups = Array.from(navContainer.querySelectorAll('.cmp-footer_nav-items')).filter(
      ng => ng.style.display === 'block'
    );
    // For each group, get its navigation list
    return navGroups.map(group => {
      const navList = group.querySelector('ul.cmp-navigation__group');
      if (!navList || navList.children.length === 0) return '';
      return navList.cloneNode(true);
    });
  })();

  // Table header row
  const headerRow = ['Columns (columns12)'];
  // Table content row: 4 columns (logo + 3 nav columns)
  const contentRow = [logoCol, ...navCols];

  // Build the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
