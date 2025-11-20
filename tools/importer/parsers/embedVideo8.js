/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Embed (embedVideo8)
  const headerRow = ['Embed (embedVideo8)'];

  // Find the iframe (YouTube embed)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  let videoTitle = '';
  if (iframe && iframe.src) {
    // Extract the canonical video URL from the YouTube embed src
    const ytMatch = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (ytMatch && ytMatch[1]) {
      videoUrl = `https://youtu.be/${ytMatch[1]}`;
    } else {
      videoUrl = iframe.src;
    }
    // Get video title from iframe attribute
    if (iframe.title) {
      videoTitle = iframe.title;
    }
  }

  // Compose cell content: include all text content present in the HTML
  const cellContent = [];
  // Add all non-empty text nodes from immediate children (not just iframe)
  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent && node.textContent.trim();
      if (txt && txt.length > 0) {
        const textEl = document.createElement('div');
        textEl.textContent = txt;
        cellContent.push(textEl);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'DIV' || node.tagName === 'SPAN')) {
      const txt = node.textContent && node.textContent.trim();
      if (txt && txt.length > 0) {
        const textEl = document.createElement('div');
        textEl.textContent = txt;
        cellContent.push(textEl);
      }
    }
  });
  if (videoTitle) {
    const titleEl = document.createElement('div');
    titleEl.textContent = videoTitle;
    cellContent.push(titleEl);
  }
  if (videoUrl) {
    const linkEl = document.createElement('a');
    linkEl.href = videoUrl;
    linkEl.textContent = videoUrl;
    cellContent.push(linkEl);
  }

  const contentRow = [cellContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
