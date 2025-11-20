/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container (with cmp-teaser__content)
  const contentDiv = element.querySelector('.cmp-teaser__content');
  if (!contentDiv) return;

  // Get the parent of cmp-teaser__content (the actual .cmp-teaser block)
  const teaserBlock = contentDiv.closest('.cmp-teaser');

  // Get the left column content (logo, heading, paragraph, button)
  const teaserContent = teaserBlock.querySelector('.cmp-teaser__content');

  // Logo image (Nutrilite logo)
  const logoDiv = teaserContent.querySelector('.cmp-teaser__image picture');
  // Heading & Paragraph
  const descDiv = teaserContent.querySelector('.cmp-teaser__description');
  // CTA Button
  const ctaDiv = teaserContent.querySelector('.cmp-teaser__action-container');

  // Compose left column cell
  const leftColumn = document.createElement('div');
  if (logoDiv) leftColumn.appendChild(logoDiv.cloneNode(true));
  if (descDiv) leftColumn.appendChild(descDiv.cloneNode(true));
  if (ctaDiv) leftColumn.appendChild(ctaDiv.cloneNode(true));

  // Find the right column image container (the second .cmp-teaser__image inside .cmp-teaser)
  const teaserImages = teaserBlock.querySelectorAll('.cmp-teaser__image');
  const productImageDiv = teaserImages.length > 1 ? teaserImages[1] : null;

  // Compose right column cell with all product images/cards
  const rightColumn = document.createElement('div');
  if (productImageDiv) {
    // Collect all <img> elements inside productImageDiv (including nested <picture> wrappers)
    const imgs = productImageDiv.querySelectorAll('img');
    imgs.forEach(function(img) {
      rightColumn.appendChild(img.cloneNode(true));
    });
  }

  // Table structure: header, then two columns (left: logo/text/button, right: product images/cards)
  const cells = [
    ['Columns (columns3)'],
    [leftColumn, rightColumn]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
