/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser content and image for each story
  function extractTeaserCells(teaserEl) {
    const content = teaserEl.querySelector('.cmp-teaser__content');
    let desc = null;
    if (content) {
      desc = document.createElement('div');
      const descBlock = content.querySelector('.cmp-teaser__description');
      if (descBlock) {
        Array.from(descBlock.childNodes).forEach(node => {
          desc.appendChild(node.cloneNode(true));
        });
      }
      const action = content.querySelector('.cmp-teaser__action-container');
      if (action) {
        desc.appendChild(action.cloneNode(true));
      }
    }
    let mainImg = null;
    const imgWrap = teaserEl.querySelector('.cmp-teaser__image');
    if (imgWrap) {
      const cmpImage = imgWrap.querySelector('.cmp-image img');
      if (cmpImage) mainImg = cmpImage;
      const smallImg = imgWrap.querySelector('.cmp-animation img');
      if (mainImg && smallImg) {
        const imgDiv = document.createElement('div');
        imgDiv.appendChild(mainImg.cloneNode(true));
        imgDiv.appendChild(smallImg.cloneNode(true));
        mainImg = imgDiv;
      }
    }
    return [desc, mainImg];
  }

  const cmpOurStory = element.querySelector('.cmp-our-story');
  const teasers = Array.from(cmpOurStory ? cmpOurStory.children : []).filter(child => child.classList.contains('teaser'));
  if (teasers.length === 0) {
    Array.from(element.children).forEach(child => {
      if (child.classList.contains('teaser')) teasers.push(child);
    });
  }

  const headerRow = ['Columns (columns26)'];
  const rows = [headerRow];
  teasers.forEach((teaser) => {
    const [desc, img] = extractTeaserCells(teaser);
    rows.push([desc, img]);
  });

  // Add the final product gallery/footer row if present
  // Look for a sequence of product images and a glass of juice
  let productRow = null;
  // Try to find a div with at least 7 images (products + glass)
  let galleryDivCandidate = null;
  if (cmpOurStory) {
    const children = Array.from(cmpOurStory.children);
    galleryDivCandidate = children.find(child => {
      const imgs = child.querySelectorAll('img');
      return imgs.length >= 7;
    });
  }
  if (!galleryDivCandidate) {
    // fallback: look for a div with >=7 images anywhere in the block
    galleryDivCandidate = Array.from(element.querySelectorAll('div')).find(div => div.querySelectorAll('img').length >= 7);
  }
  if (galleryDivCandidate) {
    const imgs = galleryDivCandidate.querySelectorAll('img');
    if (imgs.length) {
      const galleryDiv = document.createElement('div');
      imgs.forEach(img => galleryDiv.appendChild(img.cloneNode(true)));
      productRow = [galleryDiv, ''];
    }
  }
  if (productRow) {
    rows.push(productRow);
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
