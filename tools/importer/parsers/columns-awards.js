/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-awards (base: columns)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt + modelNote): multi-column table.
 *   First row = block name. Second row = N cells, one per column.
 *   Each cell = [logo image + caption]. Here N = number of award columns.
 * Each source column is .col-block with a .cmp-image__image logo and a
 * .cmp-image__title caption. (Instance selector corrected to .column-control-blocks
 * to match the actual DOM, which uses two classes "md column-control-blocks".)
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll('.col-block'));

  const row = [];
  columns.forEach((col) => {
    const cell = [];
    const img = col.querySelector('.cmp-image__image, img, picture img');
    if (img) cell.push(img);

    const caption = col.querySelector('.cmp-image__title');
    if (caption) {
      const p = document.createElement('p');
      p.textContent = caption.textContent.trim();
      cell.push(p);
    }

    // Keep column alignment consistent: push a cell even if only one part exists.
    if (cell.length) row.push(cell);
  });

  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row]; // single content row; each entry is one column's cell
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-awards',
    cells,
  });
  element.replaceWith(block);
}
