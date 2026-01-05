/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block parsing
  const headerRow = ['Cards (cards31)'];
  const rows = [headerRow];

  // Find all card content containers
  const cardContents = element.querySelectorAll('.cmp-card__content');

  cardContents.forEach(card => {
    // Image: find first img inside .cmp-card__media
    const media = card.querySelector('.cmp-card__media');
    let img = null;
    if (media) {
      img = media.querySelector('img');
    }

    // Get the link wrapping the card
    const cardLink = card.querySelector('a[href]');
    let href = '';
    if (cardLink) {
      href = cardLink.getAttribute('href');
    }

    // Text cell: gather title, description, details
    const info = card.querySelector('.cmp-card__info');
    const textFragments = [];

    // Title (h5)
    const titleDiv = info && info.querySelector('.cmp-card__title h5');
    if (titleDiv) {
      textFragments.push(titleDiv);
    }

    // Description (p.body-2)
    const descDiv = info && info.querySelector('.cmp-card__description p');
    if (descDiv) {
      textFragments.push(descDiv);
    }

    // Details (Preparation, Serves, B Natural Drinks)
    const detailsDiv = info && info.querySelector('.cmp-card__details');
    if (detailsDiv) {
      // We'll create a details row as a fragment
      const detailsRow = document.createElement('div');
      detailsRow.style.display = 'flex';
      detailsRow.style.gap = '2em';
      detailsRow.style.marginTop = '1em';
      const detailItems = detailsDiv.querySelectorAll('.cmp-card__details-content');
      detailItems.forEach(detail => {
        // Each detail: label (p.body-4) and value (h4)
        const label = detail.querySelector('p');
        const value = detail.querySelector('h4');
        const detailFragment = document.createElement('span');
        if (label) {
          detailFragment.appendChild(label.cloneNode(true));
        }
        if (value) {
          detailFragment.appendChild(document.createTextNode(' '));
          detailFragment.appendChild(value.cloneNode(true));
        }
        detailsRow.appendChild(detailFragment);
      });
      textFragments.push(detailsRow);
    }

    // If the card is wrapped in a link, wrap all text fragments in that link
    let textCell;
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.target = '_self';
      textFragments.forEach(frag => link.appendChild(frag));
      textCell = link;
    } else {
      textCell = textFragments;
    }

    // Compose row: [image, text]
    rows.push([
      img ? img : '',
      textCell
    ]);
  });

  // Create and replace block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
