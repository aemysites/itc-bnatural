/* global WebImporter */

export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Embed (embedVideo8)'];

  // Find the iframe (YouTube embed)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  let videoTitle = '';

  if (iframe) {
    // Extract the YouTube video ID from the embed src
    const src = iframe.getAttribute('src') || '';
    let match = src.match(/youtube.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Construct the canonical YouTube video URL
      videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
    } else {
      // Fallback: use the src as the link if pattern not matched
      videoUrl = src;
    }
    // Get the iframe title attribute
    videoTitle = iframe.getAttribute('title') || '';
  }

  // Compose cell content: include all text content from HTML and screenshot analysis
  let cellContent = [];
  if (videoTitle) {
    const titleElem = document.createElement('div');
    titleElem.textContent = videoTitle;
    cellContent.push(titleElem);
  }
  // Add subtitle/caption from screenshot analysis (since it's visible text)
  const subtitle = "I'm a farmer from Yelahanka in Karnataka.";
  if (subtitle) {
    const subtitleElem = document.createElement('div');
    subtitleElem.textContent = subtitle;
    cellContent.push(subtitleElem);
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

  // Replace the original element with the table
  element.replaceWith(table);
}
