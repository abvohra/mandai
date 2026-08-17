/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero (base: carousel)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt): 2-column table. First row = block name.
 *   Each subsequent row = one slide: [image][title + description + CTA].
 */
export default function parse(element, { document }) {
  // Each slide is a .banner__content-item. Exclude slick-cloned duplicates.
  let slides = Array.from(
    element.querySelectorAll('.banner__content-item:not(.slick-cloned)'),
  );
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.banner__content-item'));
  }

  const cells = [];
  slides.forEach((slide) => {
    // First cell: slide image.
    const img = slide.querySelector('picture img, img');

    // Second cell: text content (heading + optional description + optional CTA).
    const textWrap = slide.querySelector('.banner__content__text');
    const contentCell = [];
    if (textWrap) {
      const heading = textWrap.querySelector('h1, h2, h3');
      if (heading) contentCell.push(heading);
      const desc = textWrap.querySelector('span, p');
      if (desc) contentCell.push(desc);
      const ctas = Array.from(textWrap.querySelectorAll('a'));
      contentCell.push(...ctas);
    }

    // Only add rows that have real content.
    if (img || contentCell.length) {
      cells.push([img || '', contentCell.length ? contentCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-hero',
    cells,
  });
  element.replaceWith(block);
}
