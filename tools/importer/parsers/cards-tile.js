/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-tile (base: cards)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt + modelNote): 2-column table.
 *   First row = block name. Each subsequent row = one card: [image][title + description + optional CTA].
 * Note: the #dineshop instance's intro paragraph is default
 * content (kept outside the block), so its residual similarity is expected.
 * The #dineshop instance also nests a section-title heading ("A Wilder Way to
 * Eat and Shop") inside the block wrapper; it is default content and is lifted
 * out to sit BEFORE the block rather than dropped. The fragment variant's
 * heading already lives outside the block, so nothing is lifted there.
 */
export default function parse(element, { document }) {
  // Lift an inner section-title heading out as default content before the block.
  const sectionTitle = element.querySelector('h1.section-title, h2.section-title, h3.section-title, h4.section-title, .section-title');
  if (sectionTitle && sectionTitle.textContent.trim()) {
    const heading = document.createElement('h2');
    heading.textContent = sectionTitle.textContent.trim();
    element.parentNode.insertBefore(heading, element);
  }

  // Two DOM variants on the page:
  //  (a) 4-col content fragment: .md-4-col-content-fragment__item
  //  (b) feature-carousel tiles (Dine & Shop): .slick-slide cards
  let items = Array.from(element.querySelectorAll('.md-4-col-content-fragment__item'));
  let variant = 'fragment';
  if (!items.length) {
    items = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));
    if (!items.length) items = Array.from(element.querySelectorAll('.slick-slide'));
    variant = 'carousel';
  }

  const cells = [];
  items.forEach((item) => {
    const img = item.querySelector('.md-feature-carousel__img img, img, picture img');

    const contentCell = [];
    const heading = item.querySelector(
      '.all-content h2, .all-content h3, .all-content h4, .title, h2, h3, h4',
    );
    if (heading) contentCell.push(heading);

    const desc = item.querySelector('.body-text3, .body-text1, .all-content p');
    if (desc) contentCell.push(desc);

    // CTA: item is linked. For fragment variant label lives in .md-link-with-arrow;
    // for the carousel variant the tile itself is the link (use heading text as label).
    const anchor = item.querySelector('a[href]');
    if (anchor) {
      const labelEl = anchor.querySelector('.md-link-with-arrow');
      let label = labelEl ? labelEl.textContent.trim() : '';
      if (!label) {
        label = variant === 'carousel'
          ? (heading ? heading.textContent.trim() : 'Find out more')
          : anchor.textContent.trim();
      }
      const a = document.createElement('a');
      a.href = anchor.getAttribute('href');
      a.textContent = label || 'Explore More';
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
    name: 'cards-tile',
    cells,
  });
  element.replaceWith(block);
}
