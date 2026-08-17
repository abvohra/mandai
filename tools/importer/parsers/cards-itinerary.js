/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-itinerary (base: cards)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt + modelNote): 2-column table.
 *   First row = block name. Each subsequent row = one card: [image][title + description + CTA].
 * Each source card is an <a class="wrapp-img" href> wrapping image + .desc (heading + paragraph).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.animals-item'));

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('img, picture img');
    const anchor = item.querySelector('a[href]');
    const href = anchor ? anchor.getAttribute('href') : null;

    const contentCell = [];
    const heading = item.querySelector('.desc h2, .desc h3, .desc h4, h2, h3, h4');
    const desc = item.querySelector('.desc p, p');
    if (heading) contentCell.push(heading);
    if (desc) contentCell.push(desc);

    // CTA: preserve the card's destination link, labelled by the heading.
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = heading ? heading.textContent.trim() : 'Find out more';
      contentCell.push(a);
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
    name: 'cards-itinerary',
    cells,
  });
  element.replaceWith(block);
}
