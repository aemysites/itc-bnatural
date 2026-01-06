/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns32)'];

  // Left column: text (title, headline, button)
  const teaserContent = element.querySelector('.cmp-teaser__content');
  const leftColumn = [];
  if (teaserContent) {
    // Title (h3)
    const title = teaserContent.querySelector('.cmp-teaser__title');
    if (title) leftColumn.push(title);
    // Headline (h1 inside description)
    const description = teaserContent.querySelector('.cmp-teaser__description');
    if (description) leftColumn.push(description);
    // CTA button
    const action = teaserContent.querySelector('.cmp-teaser__action-link');
    if (action) leftColumn.push(action);
  }

  // Right column: guava image (decorative) + farm illustration
  const rightColumn = [];
  const animationImg = element.querySelector('.cmp-animation img');
  if (animationImg) rightColumn.push(animationImg);
  const farmImg = element.querySelector('.cmp-teaser__image img');
  if (farmImg) rightColumn.push(farmImg);

  // Build the table rows
  const rows = [
    headerRow,
    [leftColumn, rightColumn]
  ];

  // Create the columns block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
