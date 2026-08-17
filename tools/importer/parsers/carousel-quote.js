/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-quote (base: carousel)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt + modelNote): 2-column carousel table.
 *   First row = block name. Each subsequent row = one slide.
 *   These are text-only testimonial slides: [empty image cell][quote + attribution].
 * slick-cloned duplicate slides and nav chrome (Prev/Next, dots) are excluded;
 * residual similarity gap is from those cloned slides and nav chrome in the
 * source text; every unique review quote and attribution is captured.
 */
export default function parse(element, { document }) {
  let slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.slick-slide'));
  }

  const cells = [];
  slides.forEach((slide) => {
    const quote = slide.querySelector('.message, .md-quote-carousel__message .message');
    const attribution = slide.querySelector('.body-text2');

    const contentCell = [];
    if (quote) contentCell.push(quote);
    if (attribution) contentCell.push(attribution);

    if (contentCell.length) {
      // Text-only slide: first (image) cell empty, content in the second cell.
      cells.push(['', contentCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-quote',
    cells,
  });
  element.replaceWith(block);
}
