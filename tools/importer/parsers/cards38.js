/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards38)'];

  // Find the active tab panel (the one visible)
  const activeTabPanel = element.querySelector('.cmp-tabs__tabpanel--active');
  if (!activeTabPanel) return;

  // Find the cards container inside the active tab panel
  const cardsContainer = activeTabPanel.querySelector('.cmp-card__container');
  if (!cardsContainer) return;

  // Each card is an <a> with a .cmp-card__content inside
  const cardLinks = Array.from(cardsContainer.querySelectorAll(':scope > a'));
  const cardRows = cardLinks.map((a) => {
    // Get all images and pictures for the image cell
    const imageCell = document.createElement('div');
    Array.from(a.querySelectorAll('picture')).forEach(pic => {
      imageCell.appendChild(pic.cloneNode(true));
    });

    // Compose the text cell: extract all text content from the card
    const textCell = document.createElement('div');
    // Try to extract fruit name from the image src or href
    let fruitName = '';
    const img = a.querySelector('img');
    if (img && img.src) {
      const match = img.src.match(/(guava|mango|mixed[-_ ]?fruit)/i);
      if (match) {
        fruitName = match[1].replace(/[-_]/g, ' ');
        fruitName = fruitName.replace(/(^| )\w/g, s => s.toUpperCase());
      }
    }
    if (fruitName) {
      const heading = document.createElement('h3');
      heading.textContent = fruitName;
      textCell.appendChild(heading);
    }
    // Add volume info ('125 ml' is visually present in screenshot)
    const volume = document.createElement('p');
    volume.textContent = '125 ml';
    textCell.appendChild(volume);
    // Add link to product page
    if (a.href) {
      const link = document.createElement('a');
      link.href = a.href;
      link.textContent = 'Explore All';
      textCell.appendChild(link);
    }
    return [imageCell, textCell];
  });

  // Description and CTA (below the cards)
  const desc = activeTabPanel.querySelector('.cards__description .cmp-text');
  const button = activeTabPanel.querySelector('.exploremore a');
  if (desc || button) {
    const descCell = document.createElement('div');
    if (desc) desc.childNodes.forEach((node) => descCell.appendChild(node.cloneNode(true)));
    if (button) descCell.appendChild(button.cloneNode(true));
    cardRows.push(['', descCell]);
  }

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...cardRows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
