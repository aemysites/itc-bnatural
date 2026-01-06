/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns12)'];

  // --- COLUMN 1: LOGOS + TEXT ---
  // Find the desktop logo container (contains both logos)
  let logoContainer = element.querySelector('.bnatural-footer-desktop-div');
  if (!logoContainer) {
    // fallback to mobile if desktop not found
    logoContainer = element.querySelector('.bnatural-footer-mobile-div');
  }

  // Find the text 'Enduring Value' and 'Lic. No. 10012051000312'
  // These are inside .cmp-footer__nav-logo, outside the logo images
  let footerNavLogo = element.querySelector('.cmp-footer__nav-logo');
  let footerText = '';
  if (footerNavLogo) {
    // Find all text nodes (not inside <img>)
    // Look for text in descendants with textContent matching those strings
    const walker = document.createTreeWalker(footerNavLogo, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const txt = node.textContent.trim();
      if (txt && (txt.includes('Enduring Value') || txt.includes('Lic. No.'))) {
        footerText += txt + ' ';
      }
    }
    footerText = footerText.trim();
  }
  // Compose column 1: logo container + text
  const col1 = [];
  if (logoContainer) col1.push(logoContainer);
  if (footerText) {
    const textDiv = document.createElement('div');
    textDiv.textContent = footerText;
    col1.push(textDiv);
  }

  // --- COLUMN 2/3/4: NAV GROUPS ---
  const navGroups = Array.from(
    element.querySelectorAll('.cmp-footer_nav-items[style*="display: block"]')
  );
  const nav1 = navGroups[0] || null;
  const nav2 = navGroups[1] || null;
  const nav3 = navGroups[2] || null;

  function extractNavList(navGroup) {
    if (!navGroup) return '';
    const ul = navGroup.querySelector('ul');
    return ul ? ul : '';
  }

  const col2 = extractNavList(nav1);
  const col3 = extractNavList(nav2);
  const col4 = extractNavList(nav3);

  // Build the table rows
  const cells = [
    headerRow,
    [col1, col2, col3, col4],
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
