/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards38)'];

  // Find the active tabpanel (the visible cards group)
  const activeTabPanel = element.querySelector('.cmp-tabs__tabpanel--active');
  if (!activeTabPanel) return;

  // Find the cards container within the active tabpanel
  const cardsContainer = activeTabPanel.querySelector('.cmp-card__container');
  if (!cardsContainer) return;

  // Each card is an <a> containing a .cmp-card__content
  const cardLinks = Array.from(cardsContainer.querySelectorAll('a'));

  // Build rows for each card
  const cardRows = cardLinks.map((cardLink) => {
    // Find the main image (default image)
    const defaultImg = cardLink.querySelector('.cmp-image__default');
    const img = defaultImg || cardLink.querySelector('img');

    // Compose the text cell: extract all text content from .cmp-card__content and from the cardLink itself
    // This includes vertical label and volume text
    let productName = '';
    let volumeText = '';
    // Try to get product name and volume from the cardLink's text content
    // The vertical label and volume are likely in the text nodes of the cardLink
    // Also, sometimes the product name is in the href
    const allText = cardLink.textContent.split('\n').map(t => t.trim()).filter(Boolean);
    // Find product name (look for first non-volume, non-empty string)
    for (let t of allText) {
      if (/\bml\b/i.test(t)) {
        volumeText = t;
      } else if (!productName && t.length > 2) {
        productName = t;
      }
    }
    // If productName is still empty, try to extract from href
    if (!productName && cardLink.href) {
      const match = cardLink.href.match(/\/([a-zA-Z0-9\-]+)\.html/);
      if (match) {
        productName = match[1].replace(/-/g, ' ');
      }
    }
    // Compose cell: product name as heading, volume as paragraph
    const cell = document.createElement('div');
    if (productName) {
      const h = document.createElement('h3');
      h.textContent = productName;
      cell.appendChild(h);
    }
    if (volumeText) {
      const p = document.createElement('p');
      p.textContent = volumeText;
      cell.appendChild(p);
    }
    return [img, cell];
  });

  // Find the description text (below cards)
  const descContainer = activeTabPanel.querySelector('.cards__description .cmp-text');
  let descText = '';
  if (descContainer) {
    // Collect all non-empty paragraphs
    const validPs = Array.from(descContainer.querySelectorAll('p')).filter(p => p.textContent.trim() && p.textContent.trim() !== '\u00A0');
    descText = validPs.map(p => p.textContent.trim()).join(' ');
  }

  // Find the CTA button (Explore All)
  const buttonContainer = activeTabPanel.querySelector('.exploremore.button');
  let buttonEl = null;
  if (buttonContainer) {
    const btn = buttonContainer.querySelector('a');
    if (btn) buttonEl = btn;
  }

  // Add description and CTA as a single row if either exists
  let extraRow = null;
  if (descText || buttonEl) {
    // Compose cell with full description text and button
    const cell = document.createElement('div');
    if (descText) {
      const descP = document.createElement('p');
      descP.textContent = descText;
      cell.appendChild(descP);
    }
    if (buttonEl) {
      cell.appendChild(buttonEl.cloneNode(true));
    }
    extraRow = ['', cell];
  }

  // Compose the table rows
  const rows = [headerRow, ...cardRows];
  if (extraRow) rows.push(extraRow);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
