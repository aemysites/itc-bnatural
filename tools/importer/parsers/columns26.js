/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser content and images
  function extractTeaserContent(teaser) {
    // Description (heading + paragraph)
    const desc = teaser.querySelector('.cmp-teaser__description');
    // CTA/action (optional)
    const action = teaser.querySelector('.cmp-teaser__action-container');
    // Main image (first .cmp-image picture)
    const mainImgPicture = teaser.querySelector('.cmp-teaser__image .cmp-image picture');
    // Small image (optional, .cmp-animation picture)
    const smallImgPicture = teaser.querySelector('.cmp-animation picture');
    // Compose left and right cell content
    let leftContent, rightContent;
    // Determine alignment by class
    const isLeftImage = teaser.closest('.teaser')?.classList.contains('cmp-teaser--left-image-aligned');
    if (isLeftImage) {
      // Image left, text right
      leftContent = document.createElement('div');
      if (mainImgPicture) leftContent.append(mainImgPicture.cloneNode(true));
      if (smallImgPicture) leftContent.append(smallImgPicture.cloneNode(true));
      rightContent = document.createElement('div');
      if (desc) rightContent.append(desc.cloneNode(true));
      if (action) rightContent.append(action.cloneNode(true));
    } else {
      // Text left, image right
      leftContent = document.createElement('div');
      if (desc) leftContent.append(desc.cloneNode(true));
      if (action) leftContent.append(action.cloneNode(true));
      rightContent = document.createElement('div');
      if (mainImgPicture) rightContent.append(mainImgPicture.cloneNode(true));
      if (smallImgPicture) rightContent.append(smallImgPicture.cloneNode(true));
    }
    return [leftContent, rightContent];
  }

  // Find all top-level teasers
  const teasers = Array.from(element.querySelectorAll(':scope .cmp-our-story > .teaser'));
  // Build rows for each teaser
  const rows = teasers.map(teaser => {
    const [left, right] = extractTeaserContent(teaser);
    return [left, right];
  });

  // Header row
  const headerRow = ['Columns (columns26)'];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace element
  element.replaceWith(table);
}
