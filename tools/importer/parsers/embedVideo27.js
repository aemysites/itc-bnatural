/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo27)
  const headerRow = ['Embed (embedVideo27)'];

  // Find the iframe (video embed)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  if (iframe) {
    // Extract the actual YouTube video URL from the embed src
    const match = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else if (iframe.src) {
      videoUrl = iframe.src;
    }
  }

  // Extract visible text content from the element (e.g., video title)
  let textContent = '';
  // Try to get the iframe title first
  if (iframe && iframe.title) {
    textContent = iframe.title;
  } else {
    // Fallback: get any text from the element
    textContent = element.textContent.trim();
  }

  // Create cell content: text (if any) and video link
  const cellContent = [];
  if (textContent) {
    const textEl = document.createElement('p');
    textEl.textContent = textContent;
    cellContent.push(textEl);
  }
  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }

  // Content row: all cell content in a single cell
  const contentRow = [cellContent];

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
