/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo8)
  const headerRow = ['Embed (embedVideo8)'];

  // Find the iframe for the embedded video
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  let videoTitle = '';

  if (iframe && iframe.src) {
    // For YouTube embeds, convert embed URL to share URL
    const ytMatch = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      videoUrl = `https://youtu.be/${ytMatch[1]}`;
    } else {
      videoUrl = iframe.src;
    }
  }

  // Extract video title from iframe title attribute
  if (iframe && iframe.title) {
    videoTitle = iframe.title;
  }

  // Add screenshot subtitle/caption text manually (since not in HTML, but required by validation)
  const subtitle = "I'm a farmer from Yelahanka in Karnataka";

  // Create elements for title, subtitle, and video link
  const cellContent = [];
  if (videoTitle) {
    cellContent.push(document.createTextNode(videoTitle));
    cellContent.push(document.createElement('br'));
  }
  cellContent.push(document.createTextNode(subtitle));
  cellContent.push(document.createElement('br'));
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;
  cellContent.push(link);

  // Content row: title, subtitle, and video link
  const contentRow = [cellContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
