/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get hero image
  function getHeroImage(el) {
    // Look for the first <img> inside carousel or teaser image
    return el.querySelector('.cmp-carousel__item img, .cmp-image__image, picture img');
  }

  // Helper: get all text content in hero block, including headings and paragraphs
  function getAllHeroText(el) {
    const nodes = [];
    // Find all headings and paragraphs anywhere in the block
    // Only include those with non-empty text
    // For this block, also include any text nodes inside .cmp-carousel__item
    const textSelectors = [
      '.cmp-carousel__item h1',
      '.cmp-carousel__item h2',
      '.cmp-carousel__item h3',
      '.cmp-carousel__item p',
      '.cmp-carousel__item div',
      '.cmp-text h1',
      '.cmp-text h2',
      '.cmp-text h3',
      '.cmp-text p',
      '.cmp-text div',
      '.desc-1 .cmp-text h1',
      '.desc-1 .cmp-text h2',
      '.desc-1 .cmp-text h3',
      '.desc-1 .cmp-text p',
      '.desc-1 .cmp-text div'
    ];
    textSelectors.forEach(sel => {
      el.querySelectorAll(sel).forEach(n => {
        const txt = n.textContent.replace(/\u00A0/g, '').trim();
        if (txt.length > 0) nodes.push(n);
      });
    });
    return nodes;
  }

  // 1. Header row
  const headerRow = ['Hero (hero10)'];

  // 2. Image row
  const heroImage = getHeroImage(element);
  const imageRow = [heroImage ? heroImage : ''];

  // 3. Content row: all text content (headings, paragraphs, divs)
  const content = getAllHeroText(element);

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    [content]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
