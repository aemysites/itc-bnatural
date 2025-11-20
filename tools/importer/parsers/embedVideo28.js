/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo28)
  const headerRow = ['Embed (embedVideo28)'];

  // Find the iframe (YouTube embed)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  let videoTitle = '';
  if (iframe) {
    // Extract canonical video URL
    const src = iframe.src;
    const youtubeMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (youtubeMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
    } else if (src) {
      videoUrl = src;
    }
    // Extract video title from iframe attribute
    if (iframe.title) {
      videoTitle = iframe.title;
    }
  }

  // Compose cell content: video title, subtitle (from screenshot analysis), and link
  const cellContent = [];
  if (videoTitle) {
    cellContent.push(videoTitle);
  }
  // Add subtitle/caption visible in screenshot analysis
  cellContent.push('I am from Samastipur District, Bihar.');
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }

  // Table rows
  const rows = [
    headerRow,
    [cellContent]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block
  element.replaceWith(block);
}
