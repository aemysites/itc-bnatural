/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards29) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards29)'];
  const rows = [headerRow];

  // Select all card anchor elements inside the container
  const cardLinks = element.querySelectorAll('a.cmp-product-list__link');

  cardLinks.forEach((card) => {
    // --- IMAGE CELL ---
    // Collect both <picture> elements (default and hover)
    const pictures = card.querySelectorAll('picture');
    let imageCellContent = [];
    pictures.forEach((pic) => {
      const img = pic.querySelector('img');
      if (img) imageCellContent.push(img);
    });

    // --- TEXT CELL ---
    // Get the flavor name from the anchor's data-title attribute (uppercase for fidelity)
    const flavor = card.getAttribute('data-title') || '';
    const textCellContent = [];
    // Only add heading if flavor is present as visible text in the HTML
    // In this source, flavor is not present as visible text, so do not add it
    const details = card.querySelector('.cmp-product-list__details');
    if (details) {
      // Description paragraph
      const desc = details.querySelector('.cmp-product-list__details-description');
      if (desc) textCellContent.push(desc);
      // Available details
      const availDetails = details.querySelector('.cmp-product-list__available-details');
      if (availDetails) {
        const availLabel = availDetails.querySelector('p');
        const size = availDetails.querySelector('h2');
        if (availLabel) textCellContent.push(availLabel);
        if (size) textCellContent.push(size);
      }
    }
    // Compose row: [all images, text]
    rows.push([
      imageCellContent.length ? imageCellContent : '',
      textCellContent.length ? textCellContent : ''
    ]);
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
