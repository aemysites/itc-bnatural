/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns3)'];

  // --- LEFT COLUMN ---
  const contentDiv = element.querySelector('.cmp-teaser__content');
  const logoPicture = contentDiv?.querySelector('.cmp-teaser__image picture');
  const descDiv = contentDiv?.querySelector('.cmp-teaser__description');
  const cta = contentDiv?.querySelector('.cmp-teaser__action-link');

  // Compose left column content
  const leftColContent = document.createElement('div');
  if (logoPicture) leftColContent.appendChild(logoPicture);
  if (descDiv) leftColContent.appendChild(descDiv);
  if (cta) leftColContent.appendChild(cta);

  // --- RIGHT COLUMN ---
  // Find the second .cmp-teaser__image (contains the main product image)
  const teaserImages = Array.from(element.querySelectorAll('.cmp-teaser__image'));
  let rightColContent = document.createElement('div');
  if (teaserImages.length > 1) {
    const secondImageDiv = teaserImages[1];
    const productPicture = secondImageDiv.querySelector('picture');
    if (productPicture) rightColContent.appendChild(productPicture);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
