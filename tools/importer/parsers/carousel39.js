/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header row
  const headerRow = ['Carousel (carousel39)'];
  const rows = [headerRow];

  // Defensive: find carousel content container
  const carouselContent = element.querySelector('.cmp-carousel__content');
  if (!carouselContent) {
    element.replaceWith(WebImporter.DOMUtils.createTable(rows, document));
    return;
  }

  // Find all carousel slides (items)
  const items = Array.from(carouselContent.querySelectorAll('.cmp-carousel__item'));

  items.forEach((item) => {
    let imageCell = null;
    let textCell = null;

    // Try to find an image for the slide
    const img = item.querySelector('img');
    if (img) {
      imageCell = img;
    }

    // Try to find video for the slide
    const video = item.querySelector('video');
    if (!imageCell && video && video.src) {
      const link = document.createElement('a');
      link.href = video.src;
      link.textContent = video.src;
      imageCell = link;
    }

    // Defensive: If no image or video, skip this slide
    if (!imageCell) return;

    // Extract all visible text content from the slide, including branding and product names
    // Remove navigation/actions/indicators from a clone
    const clone = item.cloneNode(true);
    Array.from(clone.querySelectorAll('.cmp-carousel__actions, .cmp-carousel__indicators, img, video, picture')).forEach(e => e.remove());

    // Get all text nodes from the clone
    let textNodes = [];
    function getTextNodes(node) {
      node.childNodes.forEach(child => {
        if (child.nodeType === 3 && child.textContent.trim()) {
          textNodes.push(child.textContent.trim());
        } else if (child.nodeType === 1) {
          getTextNodes(child);
        }
      });
    }
    getTextNodes(clone);

    // Get all alt text from images in the slide
    let altTexts = [];
    Array.from(item.querySelectorAll('img')).forEach(imgEl => {
      if (imgEl.alt && imgEl.alt.trim()) {
        altTexts.push(imgEl.alt.trim());
      }
    });

    // Get all aria-labels from the slide and descendants
    let ariaLabels = [];
    Array.from(item.querySelectorAll('[aria-label]')).forEach(el => {
      if (el.getAttribute('aria-label') && el.getAttribute('aria-label').trim()) {
        ariaLabels.push(el.getAttribute('aria-label').trim());
      }
    });
    if (item.getAttribute('aria-label') && item.getAttribute('aria-label').trim()) {
      ariaLabels.push(item.getAttribute('aria-label').trim());
    }

    // Combine all extracted text
    let allText = [...altTexts, ...ariaLabels, ...textNodes].join(' ').replace(/\s+/g, ' ').trim();

    if (allText) {
      const p = document.createElement('p');
      p.textContent = allText;
      textCell = [p];
    } else {
      textCell = '';
    }

    rows.push([imageCell, textCell]);
  });

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
