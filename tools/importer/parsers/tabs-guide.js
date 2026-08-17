/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-guide (base: tabs)
 * Source: https://www.mandai.com/en.html
 * Structure (from library-description.txt + modelNote): 2-column table.
 *   First row = block name. Each subsequent row = one tab:
 *   [tab label][panel content: heading + paragraph + image + CTA].
 * Each source tab is a .tab_item containing a .tab_btn-tab button and a
 * .tab_info-container panel.
 * The block wrapper also nests the section heading ("Visitor Guide") as a
 * top-level h2 (a direct heading, not part of any tab panel); it is default
 * content and is lifted out to sit BEFORE the block rather than dropped.
 */
export default function parse(element, { document }) {
  // Lift the section heading out as default content before the block. It is a
  // heading that is NOT inside a .tab_item panel (those are handled per-tab).
  const topHeading = Array.from(element.querySelectorAll('h1, h2, h3'))
    .find((h) => !h.closest('.tab_item') && h.textContent.trim());
  if (topHeading) {
    const heading = document.createElement('h2');
    heading.textContent = topHeading.textContent.trim();
    element.parentNode.insertBefore(heading, element);
  }

  const tabs = Array.from(element.querySelectorAll('.tab_item'));

  const cells = [];
  tabs.forEach((tab) => {
    // Tab label.
    const labelEl = tab.querySelector('.tab_btn-tab, button');
    const label = labelEl ? labelEl.textContent.trim() : '';

    // Panel content.
    const contentCell = [];
    const heading = tab.querySelector('.tab_info-content_header, h2, h3, h4');
    if (heading) contentCell.push(heading);

    const descWrap = tab.querySelector('.tab_info-content_description');
    if (descWrap) {
      const ps = Array.from(descWrap.querySelectorAll('p'));
      if (ps.length) contentCell.push(...ps);
      else contentCell.push(descWrap);
    }

    const img = tab.querySelector('.tab_info-image, img, picture img');
    if (img) contentCell.push(img);

    const link = tab.querySelector('.tab_info-content_link, a[href]');
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      // Strip decorative arrow; keep just the visible label text.
      a.textContent = (link.textContent || '').trim() || 'Explore More';
      contentCell.push(a);
    }

    if (label || contentCell.length) {
      const labelCell = document.createElement('p');
      labelCell.textContent = label;
      cells.push([labelCell, contentCell.length ? contentCell : '']);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'tabs-guide',
    cells,
  });
  element.replaceWith(block);
}
