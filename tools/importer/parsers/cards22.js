/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards22) block parser
  // 1. Header row
  const headerRow = ['Cards (cards22)'];

  // 2. Find all card anchor elements (each card is inside an <a> tag)
  const cardAnchors = Array.from(element.querySelectorAll('a'));

  // 3. Build card rows
  const cardRows = cardAnchors.map((anchor) => {
    // Image: find <img> inside <picture> inside .cmp-card__media
    const media = anchor.querySelector('.cmp-card__media');
    let imgEl = null;
    if (media) {
      const picture = media.querySelector('picture');
      if (picture) {
        imgEl = picture.querySelector('img');
      }
    }

    // Text: find card title inside .cmp-card__title > h3
    let titleEl = null;
    const titleDiv = anchor.querySelector('.cmp-card__title');
    if (titleDiv) {
      titleEl = titleDiv.querySelector('h3');
    }

    // Compose cell contents
    // First cell: image element (mandatory)
    // Second cell: title element (mandatory)
    const imageCell = imgEl ? imgEl : '';
    const textCell = titleEl ? titleEl : '';
    return [imageCell, textCell];
  });

  // 4. Assemble table rows
  const rows = [headerRow, ...cardRows];

  // 5. Create block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace original element with block table
  element.replaceWith(blockTable);
}
