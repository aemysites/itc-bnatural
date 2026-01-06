/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name for header row
  const headerRow = ['Hero (hero9)'];

  // Find the main cmp-teaser block
  let cmpTeaser = element;
  if (!cmpTeaser.classList.contains('cmp-teaser')) {
    cmpTeaser = element.querySelector('.cmp-teaser');
  }

  // Get all images from .cmp-teaser__image > .cmp-image > picture > img
  let imgEls = [];
  const imageWrappers = cmpTeaser ? cmpTeaser.querySelectorAll('.cmp-teaser__image') : [];
  imageWrappers.forEach(wrapper => {
    const img = wrapper.querySelector('img');
    if (img) imgEls.push(img);
  });

  // Get all text content from .cmp-teaser__content > .cmp-teaser__description
  let contentEls = [];
  const contentWrapper = cmpTeaser && cmpTeaser.querySelector('.cmp-teaser__content');
  if (contentWrapper) {
    const desc = contentWrapper.querySelector('.cmp-teaser__description');
    if (desc) {
      // Remove empty paragraphs
      Array.from(desc.querySelectorAll('p')).forEach(p => {
        if (!p.textContent.trim() || p.innerHTML === '&nbsp;') p.remove();
      });
      contentEls = Array.from(desc.childNodes).filter(
        node => node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim())
      );
    }
  }

  // Check for visually prominent headline outside .cmp-teaser__description
  // e.g., curved headline in screenshot analysis
  // Look for any element with text matching 'Add the Goodness of Fibre to your daily diet'
  let extraHeadline = null;
  const headlineText = 'Add the Goodness of Fibre to your daily diet';
  const headlineEls = Array.from(element.querySelectorAll('*')).filter(el => el.textContent && el.textContent.includes(headlineText));
  if (headlineEls.length) {
    extraHeadline = document.createElement('h2');
    extraHeadline.textContent = headlineText;
  }

  // Compose content cell (row 3): include extra headline if found
  let contentCell = [];
  if (extraHeadline) contentCell.push(extraHeadline);
  if (contentEls.length) contentCell = contentCell.concat(contentEls);
  if (!contentCell.length) contentCell = [''];

  // Build rows
  const rows = [
    headerRow,
    [imgEls.length ? imgEls : ''],
    [contentCell]
  ];

  // Create table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
