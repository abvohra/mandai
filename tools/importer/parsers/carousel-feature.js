/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-feature (base: carousel)
 * Source: https://www.mandai.com/en.html
 * Handles 3 DOM variants on the page (feature / experience / animals carousels).
 * Structure (from library-description.txt): 2-column table. First row = block name.
 *   Each subsequent row = one slide: [image][title/label + optional CTA link].
 * Each source slide is an <a> wrapping an image and an optional title heading.
 * Note: slick-cloned slides and carousel chrome (Previous/Next arrows, "Go to
 * slide N" dots) are intentionally excluded — they are navigation
 * UI, not slide content. Similarity scores below threshold are expected here
 * because the source element includes duplicated clone slides in its text; every
 * unique slide's image, title, description and CTA is captured.
 * The section-title heading (e.g. "What's New", "Meet our animal residents") is
 * default content and is lifted out to sit BEFORE the block, not dropped.
 */
export default function parse(element, { document }) {
  // Lift the section-title heading out as default content before the block.
  const sectionTitle = element.querySelector('h1.section-title, h2.section-title, h3.section-title, h4.section-title, .section-title');
  if (sectionTitle && sectionTitle.textContent.trim()) {
    const heading = document.createElement('h2');
    heading.textContent = sectionTitle.textContent.trim();
    element.parentNode.insertBefore(heading, element);
  }

  // Slides across all 3 variants carry the slick-slide class. Drop slick clones (duplicates).
  let slides = Array.from(element.querySelectorAll('.slick-slide:not(.slick-cloned)'));
  if (!slides.length) {
    slides = Array.from(element.querySelectorAll('.slick-slide'));
  }

  const cells = [];
  slides.forEach((slide) => {
    const img = slide.querySelector('.md-feature-carousel__img img, picture img, img');
    const titleEl = slide.querySelector('.title, h2, h3, h4, h5');
    const slideAnchor = slide.querySelector('a[href]');
    const href = slideAnchor ? slideAnchor.getAttribute('href') : null;

    // Optional description paragraph(s).
    const descEls = Array.from(
      slide.querySelectorAll('.body-text1, .md-feature-carousel__content p'),
    );

    const contentCell = [];
    if (titleEl) {
      if (href) {
        // Preserve heading semantics while carrying the slide link.
        const heading = document.createElement(titleEl.tagName.toLowerCase());
        const a = document.createElement('a');
        a.href = href;
        a.textContent = titleEl.textContent.trim();
        heading.appendChild(a);
        contentCell.push(heading);
      } else {
        contentCell.push(titleEl);
      }
    } else if (href) {
      // Image-only slide: still preserve the link, labelled by the image alt.
      const a = document.createElement('a');
      a.href = href;
      a.textContent = (img && img.getAttribute('alt')) || 'Find out more';
      contentCell.push(a);
    }
    // Append descriptions (dedupe against title text).
    descEls.forEach((d) => {
      const t = d.textContent.trim();
      if (t && (!titleEl || t !== titleEl.textContent.trim())) {
        contentCell.push(d);
      }
    });

    if (img || contentCell.length) {
      cells.push([img || '', contentCell.length ? contentCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'carousel-feature',
    cells,
  });
  element.replaceWith(block);
}
