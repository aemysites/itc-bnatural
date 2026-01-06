/* global WebImporter */

export default function parse(element, { document }) {
  // Header row as per block guidelines
  const headerRow = ['Embed (embedVideo27)'];

  // Find the YouTube iframe
  const iframe = element.querySelector('iframe[src*="youtube"]');
  let videoUrl = '';
  if (iframe) {
    // Extract the YouTube video ID from the src
    const src = iframe.getAttribute('src') || '';
    const match = src.match(/youtube.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      videoUrl = src.split('?')[0];
    }
  }

  // Get the video title from the iframe attribute (preserve exact spacing)
  let videoTitle = '';
  if (iframe) {
    videoTitle = iframe.getAttribute('title') || '';
  }

  // Create cell content: title (as text node), then link (on new line)
  const cellContent = [];
  if (videoTitle) {
    cellContent.push(document.createTextNode(videoTitle));
    cellContent.push(document.createElement('br'));
  }
  if (videoUrl) {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.textContent = videoUrl;
    cellContent.push(link);
  }

  const contentRow = [cellContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
