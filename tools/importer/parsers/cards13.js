/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards13)'];

  // Find the card container
  const container = element.querySelector('.cmp-card__container');
  if (!container) return;

  // Select all card links (each card is inside an <a>)
  const cardLinks = Array.from(container.querySelectorAll('a'));

  const rows = [headerRow];

  cardLinks.forEach((cardLink) => {
    // Card image: find <img> inside .cmp-card__media
    const media = cardLink.querySelector('.cmp-card__media img');
    let imageEl = null;
    if (media) {
      imageEl = media;
    }

    // Card text content: title, description, details
    const info = cardLink.querySelector('.cmp-card__info');
    let textContent = document.createElement('div');
    if (info) {
      // Title
      const title = info.querySelector('.cmp-card__title h4');
      if (title) {
        textContent.appendChild(title);
      }
      // Description
      const desc = info.querySelector('.cmp-card__description p');
      if (desc) {
        textContent.appendChild(desc);
      }
      // Details (Preparation, Serves, B Natural Drinks)
      const details = info.querySelector('.cmp-card__details');
      if (details) {
        // We'll group all details into a single line, as in the screenshot
        const detailContents = Array.from(details.querySelectorAll('.cmp-card__details-content'));
        const detailDiv = document.createElement('div');
        detailDiv.style.display = 'flex';
        detailDiv.style.gap = '2em';
        detailContents.forEach((detail) => {
          const label = detail.querySelector('p');
          const value = detail.querySelector('h4');
          const detailItem = document.createElement('span');
          if (label) {
            detailItem.appendChild(label.cloneNode(true));
          }
          if (value) {
            detailItem.appendChild(document.createTextNode(' '));
            detailItem.appendChild(value.cloneNode(true));
          }
          detailDiv.appendChild(detailItem);
        });
        textContent.appendChild(detailDiv);
      }
    }
    rows.push([imageEl, textContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
