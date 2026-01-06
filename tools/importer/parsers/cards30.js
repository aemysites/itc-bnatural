/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards30) block header
  const headerRow = ['Cards (cards30)'];

  // Find all card anchor wrappers (each card is an <a> containing .cmp-card__content)
  const cardLinks = element.querySelectorAll('.cmp-card__container > a');

  const rows = Array.from(cardLinks).map((a) => {
    // IMAGE CELL: get the image, wrap in link
    const img = a.querySelector('.cmp-card__media img');
    let imageEl = null;
    if (img) {
      // Wrap image in a link
      const imgLink = document.createElement('a');
      imgLink.href = a.href;
      imgLink.target = a.target || '_self';
      imgLink.appendChild(img.cloneNode(true));
      imageEl = imgLink;
    }

    // TEXT CELL: date, title, description
    let textContent = document.createElement('div');
    const info = a.querySelector('.cmp-card__info');
    if (info) {
      // Date/category
      const date = info.querySelector('.cmp-card__title');
      if (date) {
        // Use only the text content, not the original div
        const p = date.querySelector('p');
        if (p) {
          textContent.appendChild(document.createTextNode(p.textContent));
        }
      }
      // Title/description
      const desc = info.querySelector('.cmp-card__description h4');
      if (desc) {
        const h4 = document.createElement('strong');
        h4.textContent = desc.textContent;
        textContent.appendChild(document.createElement('br'));
        textContent.appendChild(h4);
      }
    }
    // Remove unnecessary divs/classes/attributes
    // Only include plain text and heading

    return [imageEl, textContent];
  });

  // Compose the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
