/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero5) block: 1 col x 3 rows
  // 1st row: block name
  // 2nd row: background image (optional)
  // 3rd row: text content (heading, subheading, CTA)

  // --- 1st row: header ---
  const headerRow = ['Hero (hero5)'];

  // --- 2nd row: background image ---
  let imageCell = '';
  // Find the main hero image (the product image in the carousel/teaser)
  const img = element.querySelector('.cmp-teaser__image img, .cmp-image__image, img');
  if (img) imageCell = img;

  // --- 3rd row: text content ---
  // Extract all visible text from the teaser and its descendants, including alt attributes
  let textCell = '';
  const textFragments = [];

  // Get all text nodes and alt attributes from teaser descendants
  const teaser = element.querySelector('.cmp-teaser');
  if (teaser) {
    teaser.querySelectorAll('*').forEach((node) => {
      // Text nodes
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
          textFragments.push(child.textContent.trim());
        }
      });
      // Alt text from images
      if (node.tagName === 'IMG' && node.alt && node.alt.trim()) {
        textFragments.push(node.alt.trim());
      }
    });
  }

  // Get aria-label from carousel item (may contain headline)
  const carouselItem = element.querySelector('.cmp-carousel__item');
  if (carouselItem && carouselItem.getAttribute('aria-label')) {
    textFragments.push(carouselItem.getAttribute('aria-label').trim());
  }

  // Remove duplicates and filter out empty strings
  const uniqueText = [...new Set(textFragments)].filter(Boolean);
  if (uniqueText.length) {
    textCell = document.createElement('div');
    uniqueText.forEach((txt) => {
      const p = document.createElement('p');
      p.textContent = txt;
      textCell.appendChild(p);
    });
  }

  // Compose table rows
  const rows = [
    headerRow,
    [imageCell],
    [textCell]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
