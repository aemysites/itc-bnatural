/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel15) block header
  const headerRow = ['Carousel (carousel15)'];

  // Find carousel items (slides)
  const slides = [];
  // The carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (content) {
    // Each slide is a direct child with class 'cmp-carousel__item'
    const items = content.querySelectorAll('.cmp-carousel__item');
    items.forEach((item) => {
      // First cell: Find image (prefer <img> inside the slide)
      let img = item.querySelector('img');
      if (!img) {
        const picture = item.querySelector('picture');
        if (picture) img = picture;
      }
      // Second cell: Extract all visible text content from the slide
      let textContent = '';
      // Remove nav/indicators/scripts/styles/images from clone
      const excludeSelectors = [
        '.cmp-carousel__actions',
        '.cmp-carousel__indicators',
        'script',
        'style',
        'img',
        'picture',
      ];
      const clone = item.cloneNode(true);
      excludeSelectors.forEach(sel => {
        clone.querySelectorAll(sel).forEach(e => e.remove());
      });
      // Recursively get all text nodes
      function getTextRecursive(node) {
        let txt = '';
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          txt += node.textContent.trim() + ' ';
        }
        node.childNodes && node.childNodes.forEach(child => {
          txt += getTextRecursive(child);
        });
        return txt;
      }
      textContent = getTextRecursive(clone).replace(/\s+/g, ' ').trim();
      // Always output two columns per row, second cell empty if no text
      slides.push([img || '', textContent]);
    });
  }

  // Compose table rows
  const cells = [headerRow, ...slides];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
