/* global WebImporter */
export default function parse(element, { document }) {
  // Find the carousel content container
  const content = element.querySelector('.cmp-carousel__content');
  if (!content) return;

  // Find all carousel slides
  const slides = Array.from(content.querySelectorAll('.cmp-carousel__item'));
  if (!slides.length) return;

  // Build the table rows
  const rows = [];
  // Block header row (must match target block name exactly)
  rows.push(['Carousel (carousel39)']);

  slides.forEach((slide) => {
    // First cell: image or video (prefer image)
    let mediaCell = '';
    const img = slide.querySelector('img');
    if (img) {
      mediaCell = img;
    } else {
      const video = slide.querySelector('video');
      if (video && video.src) {
        // Convert video to a link to its src
        const a = document.createElement('a');
        a.href = video.src;
        a.textContent = video.src;
        mediaCell = a;
      }
    }

    // Second cell: extract all visible text content (including deeply nested)
    let textCell = '';
    const textParts = [];
    // Extract all visible text from elements, including alt attributes, aria-label, and textContent
    slide.querySelectorAll('*').forEach(el => {
      // Add alt text for images
      if (el.tagName === 'IMG' && el.alt && el.alt.trim()) {
        textParts.push(el.alt.trim());
      }
      // Add aria-label if present
      if (el.hasAttribute('aria-label') && el.getAttribute('aria-label').trim()) {
        textParts.push(el.getAttribute('aria-label').trim());
      }
      // Add text from text nodes
      Array.from(el.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          textParts.push(node.textContent.trim());
        }
      });
    });
    // Also add any direct text nodes of the slide itself
    Array.from(slide.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        textParts.push(node.textContent.trim());
      }
    });

    // Additionally, extract text from elements with class names that likely contain branding or product names
    // (e.g., logo, product name, bottle labels)
    // These classes are not present in the HTML, so look for any element with a role or aria-label that might be branding
    const possibleBrandEls = slide.querySelectorAll('[aria-roledescription], [role]');
    possibleBrandEls.forEach(el => {
      if (el.textContent && el.textContent.trim()) {
        textParts.push(el.textContent.trim());
      }
    });

    // Remove duplicates and join with double line breaks
    if (textParts.length) {
      textCell = [...new Set(textParts)].join('\n\n');
    }

    rows.push([mediaCell, textCell]);
  });

  // Create the table using WebImporter utility
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
