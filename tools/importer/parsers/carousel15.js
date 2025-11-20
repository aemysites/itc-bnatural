/* global WebImporter */
export default function parse(element, { document }) {
  // Carousel (carousel15) block parsing
  // Header row as per guidelines
  const headerRow = ['Carousel (carousel15)'];

  // Find the carousel slide items
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Get all text nodes from the entire carousel block (element)
  // This ensures we include all text content from the HTML, not just from the slide
  const textNodes = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (!node.textContent.trim()) return NodeFilter.FILTER_SKIP;
      if (node.parentNode && (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE')) {
        return NodeFilter.FILTER_SKIP;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node.textContent.trim());
  }
  // Remove duplicate text and join
  const allTextContent = Array.from(new Set(textNodes)).join(' ').trim();

  const rows = slides.map((slide) => {
    // IMAGE CELL
    const img = slide.querySelector('img');
    if (!img) return null;

    // TEXT CELL: Use all text found in the carousel block
    let textContent = allTextContent;
    // If nothing found, fallback to image alt
    if (!textContent && img.alt) {
      textContent = img.alt;
    }
    // If still nothing, set to empty string
    if (!textContent) textContent = '';

    return [img, textContent];
  }).filter(Boolean);

  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
