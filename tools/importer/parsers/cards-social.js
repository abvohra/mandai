/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-social (base: cards)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt + modelNote): 2-column table.
 *   First row = block name. Each subsequent row = one photo card: [image][handle link].
 * Each source item is .social-grid-component__column.photo with an <a href> (Instagram
 * post link) wrapping a .body-text2 handle, plus an image.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.social-grid-component__column.photo'));

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img, picture img');
    const anchor = item.querySelector('a[href]');
    const href = anchor ? anchor.getAttribute('href') : null;
    const handleEl = item.querySelector('.body-text2, .social-grid-component__username');
    const handle = handleEl ? handleEl.textContent.trim() : '';

    const contentCell = [];
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = handle || 'View post';
      contentCell.push(a);
    } else if (handle) {
      const p = document.createElement('p');
      p.textContent = handle;
      contentCell.push(p);
    }

    if (img || contentCell.length) {
      cells.push([img || '', contentCell.length ? contentCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-social',
    cells,
  });

  // Preserve the section title ("Share your moments with us") as default content
  // ahead of the block, so it is not dropped.
  const titleEl = element.querySelector('.social-grid-component__title h2, .social-grid-component__title h3, .social-grid-component__title h4');
  if (titleEl) {
    element.replaceWith(titleEl, block);
  } else {
    element.replaceWith(block);
  }
}
