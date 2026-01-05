/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards17) block header
  const headerRow = ['Cards (cards17)'];
  const rows = [headerRow];

  // Find all card links inside the cards container
  const cardLinks = element.querySelectorAll('.cmp-card__container > a');

  cardLinks.forEach((cardLink) => {
    // Each card's content is inside the .cmp-card__content
    const content = cardLink.querySelector('.cmp-card__content');
    if (!content) return;

    // Title: inside .cmp-card__title > h3
    const titleH3 = content.querySelector('.cmp-card__title h3');
    let titleEl = '';
    if (titleH3) {
      // Use <strong> for title as per screenshot (bolded, heading-like)
      titleEl = document.createElement('strong');
      titleEl.textContent = titleH3.textContent.trim();
    }

    // Image: inside .cmp-card__media img
    const img = content.querySelector('.cmp-card__media img');

    // Ensure image is referenced, not cloned or recreated
    let imgEl = '';
    if (img) {
      imgEl = img;
    }

    // Each card row: [image, title]
    rows.push([imgEl, titleEl]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
