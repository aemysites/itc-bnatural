/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Columns (columns12)'];

  // 2. Columns: logo (left), nav group 1 (center), nav group 2 (right-center), nav group 3 (right)
  // Find the logo area
  let logoCell = document.createElement('div');
  const logoArea = element.querySelector('.cmp-footer__nav-logo');
  if (logoArea) {
    // Get all images in logo area
    const imgs = logoArea.querySelectorAll('img');
    imgs.forEach(img => logoCell.appendChild(img.cloneNode(true)));
    // Get all visible text in logo area, including license and branding
    // Specifically extract 'Enduring Value', 'FSSAI', and 'Lic. No. 10012051000312'
    // These are likely in text nodes or spans/divs
    // We'll grab all text nodes and filter for those containing these keywords
    const walker = document.createTreeWalker(logoArea, NodeFilter.SHOW_TEXT, null);
    const textFragments = [];
    while (walker.nextNode()) {
      const txt = walker.currentNode.textContent.trim();
      if (txt && (
        txt.includes('Enduring Value') ||
        txt.includes('FSSAI') ||
        txt.includes('Lic. No.') ||
        txt.match(/\d{12,}/)
      )) {
        textFragments.push(txt);
      }
    }
    // Place each found line in its own div for clarity
    [...new Set(textFragments)].forEach(line => {
      const textDiv = document.createElement('div');
      textDiv.textContent = line;
      logoCell.appendChild(textDiv);
    });
  }

  // Find navigation columns (visible ones only)
  const navArea = element.querySelector('.cmp-footer__nav');
  let navCells = [];
  if (navArea) {
    // Only consider nav-items with style display: block
    const navGroups = Array.from(navArea.querySelectorAll('.cmp-footer_nav-items')).filter(
      ng => ng.style.display === 'block'
    );
    // Defensive: Only keep groups that have links (ul > li)
    navGroups.forEach(group => {
      // Find the .links div inside
      const linksDiv = group.querySelector('.links');
      if (linksDiv && linksDiv.querySelectorAll('li').length > 0) {
        navCells.push(linksDiv);
      }
    });
  }

  // Defensive: If navCells < 3, fill with empty cells
  while (navCells.length < 3) {
    navCells.push(document.createElement('div'));
  }

  // 3. Build table rows
  const cells = [
    headerRow,
    [logoCell, ...navCells]
  ];

  // 4. Create table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
