/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block spec
  const headerRow = ['Video (video34)'];

  // Find the video iframe (YouTube)
  const iframe = element.querySelector('iframe[src*="youtube"]');
  let videoUrl = '';
  if (iframe && iframe.src) {
    const embedMatch = iframe.src.match(/\/embed\/([\w-]+)/);
    if (embedMatch && embedMatch[1]) {
      videoUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    } else {
      videoUrl = iframe.src;
    }
  }

  // Find the poster image (the main video thumbnail)
  let posterImg = null;
  const overlayImg = element.querySelector('.video-overlay img.poster');
  if (overlayImg) {
    posterImg = overlayImg.cloneNode(true);
  } else {
    // fallback: any img in video-overlay that is not playicon.svg
    const fallbackImg = Array.from(element.querySelectorAll('.video-overlay img')).find(img => !img.src.includes('playicon.svg'));
    if (fallbackImg) posterImg = fallbackImg.cloneNode(true);
  }

  // Compose the cell contents
  const cellContents = [];
  // Add poster image if present
  if (posterImg) cellContents.push(posterImg);
  // Add video link
  if (videoUrl) {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.textContent = videoUrl;
    cellContents.push(document.createElement('br'));
    cellContents.push(a);
  }

  // Build the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [cellContents]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
