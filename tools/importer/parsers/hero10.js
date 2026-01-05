/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero10)'];

  // 2. Find the hero image (background/product image)
  let imageEl = null;
  const carouselImg = element.querySelector('.cmp-carousel__item .cmp-image img');
  if (carouselImg) {
    imageEl = carouselImg.cloneNode(true);
  }

  // 3. Compose the hero text cell with all visible text in the hero area
  // Extract all text from .cmp-text block and also include all text from .cmp-carousel__item
  let textCell = document.createElement('div');

  // Extract all text from .cmp-carousel__item (for hero headline and subheading)
  const carouselItem = element.querySelector('.cmp-carousel__item');
  if (carouselItem) {
    // Try to find text in aria-label (for hero headline)
    if (carouselItem.getAttribute('aria-label')) {
      const h1 = document.createElement('h1');
      h1.textContent = carouselItem.getAttribute('aria-label');
      textCell.appendChild(h1);
    }
    // Try to find additional description in data attributes or alt text
    const imgAlt = carouselImg && carouselImg.alt ? carouselImg.alt.trim() : '';
    if (imgAlt) {
      const p = document.createElement('p');
      p.textContent = imgAlt;
      textCell.appendChild(p);
    }
  }

  // Extract all text from .cmp-text block (for section heading)
  const textBlock = element.querySelector('.cmp-text');
  if (textBlock) {
    Array.from(textBlock.children).forEach((child) => {
      if (child.textContent && child.textContent.trim()) {
        textCell.appendChild(child.cloneNode(true));
      }
    });
  }

  // 4. Compose table rows
  const imageRow = [imageEl ? imageEl : ''];
  const textRow = [textCell];

  // 5. Create the block table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace the original element with the new block
  element.replaceWith(block);
}
