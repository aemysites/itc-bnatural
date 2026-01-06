/* global WebImporter */

export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Video (video34)'];

  // --- Find the video iframe ---
  const iframe = element.querySelector('iframe[src*="youtube"]');
  let videoUrl = '';
  if (iframe && iframe.src) {
    // Convert embed URL to watch URL for YouTube
    const match = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      videoUrl = iframe.src;
    }
  }

  // --- Find the poster image (exclude play icon) ---
  let posterImg = null;
  const posterImgEl = element.querySelector('.video-overlay .lazy-image-container img.poster');
  if (posterImgEl) {
    posterImg = posterImgEl.cloneNode(true);
  }

  // --- Find the B Natural logo (if present) ---
  let logoImg = null;
  // Find the logo image by alt text (if present in HTML)
  const logoImgEl = element.querySelector('img[alt*="Natural"]');
  if (logoImgEl) {
    logoImg = logoImgEl.cloneNode(true);
  }

  // --- Build the cell content ---
  const cellContent = [];
  if (logoImg) {
    cellContent.push(logoImg);
    cellContent.push(document.createElement('br'));
  }
  if (posterImg) {
    cellContent.push(posterImg);
    cellContent.push(document.createElement('br'));
  }
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }

  // --- Build the table ---
  const rows = [
    headerRow,
    [cellContent]
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
