/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required by block guidelines
  const headerRow = ['Embed (embedVideo28)'];

  // Find the iframe (YouTube embed)
  const iframe = element.querySelector('iframe');
  let videoUrl = '';
  if (iframe && iframe.src) {
    // Convert YouTube embed src to share URL
    const ytMatch = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
    if (ytMatch) {
      videoUrl = `https://youtu.be/${ytMatch[1]}`;
    } else {
      videoUrl = iframe.src;
    }
  }

  // Extract the video title from the iframe 'title' attribute
  let videoTitle = '';
  if (iframe && iframe.title) {
    videoTitle = iframe.title;
  }

  // Compose the cell: video title (if present) and video link
  // Also add all visible text content from the HTML (including empty .video-details)
  const cellContent = [];
  if (videoTitle) {
    const titleElem = document.createElement('div');
    titleElem.textContent = videoTitle;
    cellContent.push(titleElem);
  }

  // Extract all visible text from all child elements (including subtitles/captions)
  // Use less specific selector to get all text nodes in element
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      if (node.textContent && node.textContent.trim()) {
        return NodeFilter.FILTER_ACCEPT;
      }
      return NodeFilter.FILTER_REJECT;
    }
  });
  let textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode.textContent.trim());
  }

  // Only add text nodes that are not already present (avoid duplication of title)
  textNodes.forEach((txt) => {
    if (txt !== videoTitle && txt !== videoUrl) {
      const txtElem = document.createElement('div');
      txtElem.textContent = txt;
      cellContent.push(txtElem);
    }
  });

  if (videoUrl) {
    const videoLink = document.createElement('a');
    videoLink.href = videoUrl;
    videoLink.textContent = videoUrl;
    cellContent.push(videoLink);
  }

  const cells = [
    headerRow,
    [cellContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
