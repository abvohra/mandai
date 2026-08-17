import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// Inline SVG icons for social links, keyed by a substring of the href.
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.7v8z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 8.9A3.1 3.1 0 1 0 15.1 12 3.1 3.1 0 0 0 12 8.9m0 5.1A2 2 0 1 1 14 12a2 2 0 0 1-2 2m4-5.35a.72.72 0 1 1-.72-.72.72.72 0 0 1 .72.72M18.5 8.8a3.6 3.6 0 0 0-1-2.55 3.6 3.6 0 0 0-2.55-1c-1-.06-4-.06-5 0a3.6 3.6 0 0 0-2.55 1 3.6 3.6 0 0 0-1 2.55c-.06 1-.06 4 0 5a3.6 3.6 0 0 0 1 2.55 3.6 3.6 0 0 0 2.55 1c1 .06 4 .06 5 0a3.6 3.6 0 0 0 2.55-1 3.6 3.6 0 0 0 1-2.55c.06-1 .06-4 0-5m-1.3 6.05a2 2 0 0 1-1.14 1.14c-.8.32-2.68.24-3.56.24s-2.77.08-3.56-.24a2 2 0 0 1-1.14-1.14c-.32-.8-.24-2.68-.24-3.56s-.08-2.77.24-3.56A2 2 0 0 1 8.44 6.9c.8-.32 2.68-.24 3.56-.24s2.77-.08 3.56.24a2 2 0 0 1 1.14 1.14c.32.8.24 2.68.24 3.56s.08 2.77-.24 3.56"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12v-3.2a5.7 5.7 0 0 0-.77-.05A5.69 5.69 0 1 0 15.54 15V8.99a7.34 7.34 0 0 0 4.28 1.37V7.27a4.28 4.28 0 0 1-3.22-1.45"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 8.02a2.5 2.5 0 0 0-1.76-1.77C18.28 5.83 12 5.83 12 5.83s-6.28 0-7.84.42A2.5 2.5 0 0 0 2.4 8.02 26 26 0 0 0 2 12a26 26 0 0 0 .4 3.98 2.5 2.5 0 0 0 1.76 1.77c1.56.42 7.84.42 7.84.42s6.28 0 7.84-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-3.98M10 14.85v-5.7L14.94 12z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.94 7.5a1.56 1.56 0 1 1-3.12 0 1.56 1.56 0 0 1 3.12 0M7 8.75H3.9V19H7zM12.32 8.75H9.24V19h3.08v-5.38c0-2.87 3.74-3.1 3.74 0V19H19.2v-6.44c0-4.82-5.51-4.64-6.88-2.27z"/></svg>',
  xiaohongshu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h2.2v12H4zm5.9 0h2.05v3.2H14V6h2.05v12H14v-6.6h-2.05V18H9.9zm8.4 0H20v12h-1.7z"/></svg>',
  douyin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.77.12v-3.2a5.7 5.7 0 0 0-.77-.05A5.69 5.69 0 1 0 15.54 15V8.99a7.34 7.34 0 0 0 4.28 1.37V7.27a4.28 4.28 0 0 1-3.22-1.45"/></svg>',
};

/**
 * Fetches the footer fragment for both local (aem up) and DA/EDS environments.
 * @param {string} footerPath path to the footer doc without .plain.html
 * @returns {HTMLElement|null} the fragment root
 */
async function fetchFooter(footerPath) {
  let fragment = await loadFragment('/content/footer');
  if (!fragment) fragment = await loadFragment(footerPath);
  return fragment;
}

/**
 * Replaces the text of each social link with an inline icon based on its href.
 * @param {Element} list the social links list
 */
function decorateSocialIcons(list) {
  list.querySelectorAll('a').forEach((a) => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    const key = Object.keys(SOCIAL_ICONS).find((k) => href.includes(k));
    if (key) {
      a.setAttribute('aria-label', a.textContent.trim());
      a.innerHTML = SOCIAL_ICONS[key];
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await fetchFooter(footerPath);

  block.textContent = '';
  if (!fragment) return;

  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // unwrap default-content-wrappers so sections are direct children
  footer.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
    wrapper.replaceWith(...wrapper.childNodes);
  });

  const sections = footer.querySelectorAll(':scope > div');
  // last section is the legal bar; the rest are link/awards columns
  sections.forEach((section, i) => {
    if (i === sections.length - 1) {
      section.classList.add('footer-legal');
    } else {
      section.classList.add('footer-column');
    }
  });

  // group the columns into a top region for layout
  const columns = footer.querySelectorAll('.footer-column');
  const top = document.createElement('div');
  top.className = 'footer-top';
  columns.forEach((col) => {
    // tag the awards column (has images) and the social column
    if (col.querySelector('img')) col.classList.add('footer-awards');
    const heading = col.querySelector('h2');
    if (heading && /connect with us/i.test(heading.textContent)) {
      col.classList.add('footer-social');
      const list = col.querySelector('ul');
      if (list) decorateSocialIcons(list);
    }
    top.append(col);
  });
  footer.prepend(top);

  block.append(footer);
}
