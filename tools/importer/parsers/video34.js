/* global WebImporter */
export default function parse(element, { document }) {
  // Find the video block
  const videoBlock = element.querySelector('.video');

  // Extract poster image (from overlay)
  let posterImg = null;
  if (videoBlock) {
    const poster = videoBlock.querySelector('.video-overlay img[alt="poster"]');
    if (poster) {
      posterImg = poster.cloneNode(true);
    }
  }

  // Extract YouTube video link from iframe src
  let videoLink = null;
  if (videoBlock) {
    const iframe = videoBlock.querySelector('iframe');
    if (iframe && iframe.src) {
      const ytMatch = iframe.src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      if (ytMatch && ytMatch[1]) {
        videoLink = document.createElement('a');
        videoLink.href = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
        videoLink.textContent = videoLink.href;
      } else {
        videoLink = document.createElement('a');
        videoLink.href = iframe.src;
        videoLink.textContent = iframe.src;
      }
    }
  }

  // Compose cell content: poster image, video link
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoLink) cellContent.push(videoLink);

  // Create table: header row, content row
  const headerRow = ['Video (video34)'];
  const contentRow = [cellContent];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace element
  element.replaceWith(table);
}
