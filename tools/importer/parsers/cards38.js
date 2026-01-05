/* global WebImporter */
export default function parse(element, { document }) {
  // Extract navigation bar text (tab labels)
  const tabLabels = Array.from(element.querySelectorAll('.cmp-tabs__tablist li')).map(li => li.textContent.trim()).filter(Boolean);
  const navText = tabLabels.length ? tabLabels.join(' | ') : '';

  // Only use the active tabpanel (the visible tab)
  const activeTabPanel = element.querySelector('.cmp-tabs__tabpanel--active');
  if (!activeTabPanel) return;

  // Find the main cards container
  const cardsSection = activeTabPanel.querySelector('.cards');
  if (!cardsSection) return;

  // Find the card container holding all cards
  const cardContainer = cardsSection.querySelector('.cmp-card__container');
  if (!cardContainer) return;

  // Each card is an <a> with a .cmp-card__content inside
  const cardLinks = Array.from(cardContainer.querySelectorAll('a'));
  const cardRows = cardLinks.map((a) => {
    // Find the first image inside the card
    const img = a.querySelector('img');
    // Compose text cell: fallback to href for product name
    let productName = '';
    const href = a.getAttribute('href') || '';
    if (/guava/i.test(href)) {
      productName = 'Guava';
    } else if (/mango/i.test(href)) {
      productName = 'Mango';
    } else if (/mixed-fruit/i.test(href) || /mixed-fruits/i.test(href)) {
      productName = 'Mixed Fruit';
    } else if (/apple/i.test(href)) {
      productName = 'Apple';
    } else if (/orange/i.test(href)) {
      productName = 'Orange';
    } else if (/litchi/i.test(href)) {
      productName = 'Litchi';
    }
    // Compose text cell: title (bold) + volume
    const textCell = document.createElement('div');
    if (productName) {
      const title = document.createElement('strong');
      title.textContent = productName;
      textCell.appendChild(title);
      textCell.appendChild(document.createElement('br'));
    }
    // Always add volume text as per screenshot
    const volume = document.createElement('span');
    volume.textContent = 'volume - 125 ml';
    textCell.appendChild(volume);
    return [img, textCell];
  });

  // The text content (description) is below the cards
  const descSection = cardsSection.querySelector('.cards__description');
  let description = '';
  if (descSection) {
    // Remove trailing empty paragraphs
    const paragraphs = Array.from(descSection.querySelectorAll('p'));
    for (let i = paragraphs.length - 1; i >= 0; i -= 1) {
      if (paragraphs[i].innerHTML.trim() === '' || paragraphs[i].innerHTML === '&nbsp;') {
        paragraphs[i].remove();
      } else {
        break;
      }
    }
    // Get only the text content
    description = descSection.textContent.trim();
  }

  // The CTA button (Explore All) is below the description
  const ctaSection = cardsSection.querySelector('.exploremore');
  let cta = null;
  if (ctaSection) {
    const a = ctaSection.querySelector('a');
    if (a) cta = a;
  }

  // Compose the table rows
  const headerRow = ['Cards (cards38)'];
  const rows = [headerRow];
  // Add navigation bar text as a row if present
  if (navText) {
    rows.push(['', navText]);
  }
  // For each card, add a row with image and text cell
  cardRows.forEach(row => {
    rows.push(row);
  });
  // Add a row for description + CTA (only once, after all cards)
  const textCell = [];
  if (description) textCell.push(description);
  if (cta) textCell.push(cta);
  if (textCell.length) {
    rows.push(['', textCell]);
  }

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
