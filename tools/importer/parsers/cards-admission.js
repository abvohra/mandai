/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-admission (base: cards — "no images" variant)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt "Cards (no images)" + modelNote):
 *   1-column table. First row = block name.
 *   Each subsequent row = one card, single cell = [heading + description + CTA link].
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.md-admission-type__item'));

  const cells = [];
  items.forEach((item) => {
    const titleWrap = item.querySelector('.md-admission-type__title');
    const descWrap = item.querySelector('.md-admission-type__desc');
    const contentCell = [];

    if (titleWrap) {
      const link = titleWrap.querySelector('a[href]');
      const labelText = (titleWrap.textContent || '').trim();
      if (link) {
        // Rebuild as a clean heading-style link (drop decorative chevron icon).
        const heading = document.createElement('h3');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = labelText;
        heading.appendChild(a);
        contentCell.push(heading);
      } else if (labelText) {
        const heading = document.createElement('h3');
        heading.textContent = labelText;
        contentCell.push(heading);
      }
    }

    if (descWrap) {
      const p = descWrap.querySelector('p') || descWrap;
      contentCell.push(p);
    }

    if (contentCell.length) {
      cells.push([contentCell]); // 1-column: one row, one cell holding all elements
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-admission',
    cells,
  });
  element.replaceWith(block);
}
