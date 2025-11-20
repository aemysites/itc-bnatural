/* global WebImporter */
export default function parse(element, { document }) {
  // Find .cmp-teaser inside the block
  const teaser = element.querySelector('.cmp-teaser');
  if (!teaser) return;

  // Get image (background or prominent image)
  const teaserImageDiv = teaser.querySelector('.cmp-teaser__image');
  let image = '';
  if (teaserImageDiv) {
    const img = teaserImageDiv.querySelector('img');
    if (img) image = img;
  }

  // Get text content
  const teaserDescriptionDiv = teaser.querySelector('.cmp-teaser__content .cmp-teaser__description');
  let textNodes = [];
  if (teaserDescriptionDiv) {
    // Only keep heading tags and non-empty paragraphs (do NOT promote paragraph to heading)
    const children = Array.from(teaserDescriptionDiv.childNodes);
    children.forEach(n => {
      if (n.nodeType === 1 && /^H[1-6]$/.test(n.tagName)) {
        textNodes.push(n);
      } else if (n.nodeType === 1 && n.tagName === 'P' && n.textContent.trim()) {
        textNodes.push(n);
      } else if (n.nodeType === 3 && n.textContent.trim()) {
        textNodes.push(n);
      }
    });
    if (textNodes.length === 0) textNodes = [''];
  } else {
    textNodes = [''];
  }

  // Compose table rows
  const headerRow = ['Hero (hero9)'];
  const imageRow = [image];
  const textRow = [textNodes];

  // Create the table block
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
