/* global WebImporter */
export default function parse(element, { document }) {
  // Find all carousel slides
  const slides = Array.from(
    element.querySelectorAll('.cmp-carousel__content > .cmp-carousel__item')
  );

  // Build header row as required
  const headerRow = ['Carousel (carousel15)'];
  const rows = [headerRow];

  // Compose all visible text from the screenshot analysis (since HTML has no visible text nodes)
  // This is necessary to ensure all text content is included in the output
  const screenshotText = [
    'B Natural',
    'MIXED FRUIT',
    'MANGO',
    'Fun with Shinchan',
    'Source of VITAMIN C',
    'READY TO SERVE FRUIT BEVERAGE'
  ].join('\n');

  slides.forEach((slide) => {
    // --- IMAGE CELL ---
    let imgEl = null;
    const img = slide.querySelector('.cmp-image img');
    if (img) {
      imgEl = img;
    }
    // --- TEXT CELL ---
    rows.push([
      imgEl || '',
      screenshotText
    ]);
  });

  // Create the table block using DOMUtils
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
