/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero5)
  const headerRow = ['Hero (hero5)'];

  // Find the main carousel item
  const carouselItem = element.querySelector('.cmp-carousel__item--active') || element.querySelector('.cmp-carousel__item');

  // Get the image from the teaser inside the carousel item
  let heroImage = null;
  if (carouselItem) {
    const teaserImage = carouselItem.querySelector('.cmp-teaser__image img');
    if (teaserImage) {
      heroImage = teaserImage;
    }
  }

  // Row 2: Background image
  const imageRow = [heroImage ? heroImage : ''];

  // Row 3: Text content (heading, subheading, CTA)
  // Extract all possible text from the teaser and carousel item, including visible text from all descendants
  let textContent = [];
  if (carouselItem) {
    // Collect all text nodes inside carouselItem
    const walker = document.createTreeWalker(carouselItem, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (node.textContent && node.textContent.trim()) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_REJECT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      textContent.push(node.textContent.trim());
    }
    // Also include alt text from the image if present
    if (heroImage && heroImage.alt && heroImage.alt.trim()) {
      textContent.push(heroImage.alt.trim());
    }
  }

  // Remove duplicates and join into a single string
  const uniqueText = Array.from(new Set(textContent)).filter(Boolean).join('\n');
  const textRow = [uniqueText ? uniqueText : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    textRow
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
