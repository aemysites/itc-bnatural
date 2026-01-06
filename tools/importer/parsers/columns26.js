/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find all teaser blocks (each story_X div with class 'teaser')
  const teasers = Array.from(element.querySelectorAll('.teaser'));

  // 2. For each teaser, extract the two columns: text (content) and image
  const rows = teasers.map(teaser => {
    const content = teaser.querySelector('.cmp-teaser__content');
    const image = teaser.querySelector('.cmp-teaser__image');
    return [content || document.createElement('div'), image || document.createElement('div')];
  });

  // 3. Extract the footer/gallery row (product images and names)
  // The footer is the last block of images at the bottom of the .cmp-our-story container, not inside any teaser
  const parent = element.querySelector('.cmp-our-story');
  let galleryRow = null;
  if (parent) {
    // Get all images inside .cmp-our-story but outside .teaser blocks
    const teaserImages = Array.from(parent.querySelectorAll('.teaser img'));
    const allImages = Array.from(parent.querySelectorAll('img'));
    const galleryImages = allImages.filter(img => !teaserImages.includes(img));
    // Try to find the glass of juice (center image) and product packshots
    if (galleryImages.length > 0) {
      const galleryDiv = document.createElement('div');
      galleryImages.forEach(img => {
        galleryDiv.appendChild(img.cloneNode(true));
        // Try to get any text node immediately following the image (product name)
        if (img.nextSibling && img.nextSibling.nodeType === Node.TEXT_NODE && img.nextSibling.textContent.trim()) {
          const span = document.createElement('span');
          span.textContent = img.nextSibling.textContent.trim();
          galleryDiv.appendChild(span);
        }
      });
      // Also try to grab any text nodes directly inside parent after the last teaser
      let lastTeaser = teasers[teasers.length - 1];
      if (lastTeaser) {
        let node = lastTeaser.nextSibling;
        while (node) {
          if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
            const span = document.createElement('span');
            span.textContent = node.textContent.trim();
            galleryDiv.appendChild(span);
          }
          node = node.nextSibling;
        }
      }
      // The footer row should have the same number of columns as the main rows
      // Place gallery in first cell, empty cell in second
      galleryRow = [galleryDiv, document.createElement('div')];
    }
  }

  // 4. Build the table: header row, teaser rows, and gallery/footer row if present
  const cells = [['Columns (columns26)'], ...rows];
  if (galleryRow) {
    cells.push(galleryRow);
  }

  // 5. Replace the original element with the new table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
