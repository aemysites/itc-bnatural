/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero5)'];

  // 2. Find the main image (background/product image)
  let imgEl = null;
  const teaserImage = element.querySelector('.cmp-teaser__image .cmp-image img');
  if (teaserImage) {
    imgEl = teaserImage;
  }

  // 3. Extract all text content from the HTML (including branding, product name, etc.)
  // Collect text from all elements that might contain visible text
  const textParts = [];

  // Get alt text from image
  if (teaserImage && teaserImage.alt) {
    textParts.push(teaserImage.alt);
  }

  // Get all text from possible containers (including aria-labels and button labels)
  element.querySelectorAll('[aria-label], .cmp-carousel__item, .cmp-teaser, .cmp-teaser__content, .cmp-carousel__content').forEach((el) => {
    if (el.getAttribute('aria-label')) {
      textParts.push(el.getAttribute('aria-label').trim());
    }
    const txt = el.textContent.trim();
    if (txt) textParts.push(txt);
  });

  // Remove duplicates and join with line breaks
  const uniqueText = [...new Set(textParts)].join('\n');

  // 4. Build table rows
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''], // 2nd row: image (if found)
    [uniqueText] // 3rd row: all text content from HTML (headline, subheading, branding, etc.)
  ];

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
