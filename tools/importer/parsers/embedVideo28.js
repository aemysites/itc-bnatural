/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo28)
  const headerRow = ['Embed (embedVideo28)'];

  // Find the iframe for the embedded video
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  if (iframe && iframe.src) {
    // Try to extract the canonical video URL from the embed src
    // For YouTube, convert embed URL to watch URL
    const src = iframe.src;
    let match;
    if (src.includes('youtube.com/embed/')) {
      match = src.match(/youtube.com\/embed\/([^?&]+)/);
      if (match && match[1]) {
        videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      } else {
        videoUrl = src;
      }
    } else if (src.includes('vimeo.com')) {
      match = src.match(/vimeo.com\/(?:video\/)?([0-9]+)/);
      if (match && match[1]) {
        videoUrl = `https://vimeo.com/${match[1]}`;
      } else {
        videoUrl = src;
      }
    } else {
      videoUrl = src;
    }
  }

  // Extract all visible text content from the element (excluding iframe)
  // Also include iframe title if present
  let textContent = '';
  if (iframe && iframe.title) {
    textContent += iframe.title;
  }

  // Compose cell content: include all visible text and the video link
  const cellContent = [];
  if (textContent) {
    const textElem = document.createElement('div');
    textElem.textContent = textContent;
    cellContent.push(textElem);
  }
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }

  // Content row includes all HTML text and the video link
  const contentRow = [cellContent];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
