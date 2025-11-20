/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row as required
  const headerRow = ['Embed (embedVideo27)'];

  // Find the iframe for the embedded video
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  let videoTitle = '';
  if (iframe) {
    // Extract video URL
    if (iframe.src) {
      const src = iframe.src;
      const ytMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      if (ytMatch && ytMatch[1]) {
        videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
      } else {
        videoUrl = src;
      }
    }
    // Extract video title
    if (iframe.title) {
      videoTitle = iframe.title;
    }
  }

  // Compose the cell content: video title (as text) and video link
  const cellContent = [];
  if (videoTitle) {
    cellContent.push(document.createTextNode(videoTitle));
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  // Table structure: header, then one cell with title and video link
  const rows = [
    headerRow,
    [cellContent]
  ];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
