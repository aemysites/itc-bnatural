/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main .cmp-teaser element
  const teaser = element.querySelector('.cmp-teaser') || element;

  // --- LEFT COLUMN ---
  // Get logo image (first .cmp-teaser__image inside .cmp-teaser__content)
  const content = teaser.querySelector('.cmp-teaser__content');
  let logoImg = null;
  if (content) {
    const logoDiv = content.querySelector('.cmp-teaser__image');
    logoImg = logoDiv ? logoDiv.querySelector('img') : null;
  }
  // Get heading and paragraph
  const desc = content ? content.querySelector('.cmp-teaser__description') : null;
  const heading = desc ? desc.querySelector('h3') : null;
  const paragraph = desc ? desc.querySelector('p') : null;
  // Get CTA button
  const cta = content ? content.querySelector('.cmp-teaser__action-link') : null;

  // Compose left column
  const leftCol = document.createElement('div');
  if (logoImg) leftCol.appendChild(logoImg);
  if (heading) leftCol.appendChild(heading);
  if (paragraph) leftCol.appendChild(paragraph);
  if (cta) leftCol.appendChild(cta);

  // --- PRODUCT IMAGES (should be 3 columns) ---
  // Find all .cmp-teaser__image that are direct children of .cmp-teaser, but not inside .cmp-teaser__content
  let productImgDivs = Array.from(teaser.querySelectorAll(':scope > .cmp-teaser__image')).filter(div => !div.closest('.cmp-teaser__content'));
  // Defensive: fallback to all .cmp-teaser__image not inside .cmp-teaser__content
  if (productImgDivs.length < 3) {
    productImgDivs = Array.from(teaser.querySelectorAll('.cmp-teaser__image')).filter(div => !div.closest('.cmp-teaser__content'));
  }

  // If still less than 3, try to find all images inside .cmp-teaser__image anywhere except .cmp-teaser__content
  if (productImgDivs.length < 3) {
    productImgDivs = Array.from(teaser.querySelectorAll('img')).filter(img => {
      const parent = img.closest('.cmp-teaser__image');
      return parent && !img.closest('.cmp-teaser__content');
    }).map(img => img.closest('.cmp-teaser__image'));
  }

  // If still less than 3, duplicate the last image to fill columns
  while (productImgDivs.length < 3) {
    productImgDivs.push(productImgDivs[productImgDivs.length - 1] || document.createElement('div'));
  }

  // Only keep up to 3 images for the columns block
  const productImgCols = productImgDivs.slice(0, 3).map(div => {
    const img = div.querySelector('img');
    const col = document.createElement('div');
    if (img) {
      col.appendChild(img.cloneNode(true));
    }
    return col;
  });

  // --- Build table ---
  const headerRow = ['Columns (columns3)'];
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    [leftCol, ...productImgCols]
  ], document);

  element.replaceWith(table);
}
