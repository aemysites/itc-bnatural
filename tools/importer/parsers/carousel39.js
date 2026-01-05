/* global WebImporter */

export default function parse(element, { document }) {
  // Carousel (carousel39) block header
  const headerRow = ['Carousel (carousel39)'];
  const rows = [headerRow];

  // Find the carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Get all carousel items (slides)
  const slides = content.querySelectorAll('.cmp-carousel__item');

  slides.forEach((slide) => {
    let imageCell = '';
    let textCell = '';

    // 1. Image or Video Cell
    const video = slide.querySelector('video');
    if (video) {
      // For videos: create a link to the video source
      const videoLink = document.createElement('a');
      videoLink.href = video.src;
      videoLink.textContent = video.src;
      imageCell = videoLink;
    } else {
      // For images: find the <img> element
      const img = slide.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }

    // 2. Text Cell - Extract all visible text content from the slide
    // Only include actual visible text, not aria-label or alt unless it's visually present
    const textFragments = [];
    // Get all visible text nodes inside the slide (excluding script/style)
    slide.querySelectorAll('*:not(script):not(style)').forEach((el) => {
      if (el.childNodes.length) {
        el.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const txt = node.textContent.trim();
            if (txt) textFragments.push(txt);
          }
        });
      }
    });
    // Additionally, for this carousel, branding and product names may be outside the slide but visually present
    // Try to extract visible text from the logo area outside the slide
    const logoArea = element.querySelectorAll('img[alt], [class*=logo], [class*=brand]');
    logoArea.forEach((el) => {
      if (el.alt && !textFragments.includes(el.alt.trim())) {
        textFragments.push(el.alt.trim());
      }
      if (el.textContent && el.textContent.trim() && !textFragments.includes(el.textContent.trim())) {
        textFragments.push(el.textContent.trim());
      }
    });
    // Join all text fragments into a single string
    if (textFragments.length) {
      textCell = textFragments.join(' ');
    }

    rows.push([imageCell, textCell]);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
