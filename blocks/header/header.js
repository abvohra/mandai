import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetches the nav fragment. Works both locally (aem up serves /content/nav.plain.html)
 * and on DA/EDS (fetches {navPath}.plain.html).
 * @param {string} navPath path to the nav document without the .plain.html suffix
 * @returns {HTMLElement|null} the fragment root
 */
async function fetchNav(navPath) {
  let fragment = await loadFragment('/content/nav');
  if (!fragment) fragment = await loadFragment(navPath);
  return fragment;
}

/**
 * Closes every open dropdown in the given scope.
 * @param {Element} scope container to search within
 */
function closeAllDropdowns(scope) {
  scope.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false');
    const trigger = drop.querySelector(':scope > .nav-drop-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Turns a nav section's top-level <ul> into a list of dropdown items.
 * Each top-level <li> that contains a nested <ul> becomes a dropdown with a
 * trigger button and a panel; simple links stay as links.
 * @param {Element} list the top-level <ul>
 */
function decorateNavList(list) {
  list.querySelectorAll(':scope > li').forEach((li) => {
    const panel = li.querySelector(':scope > ul');
    const label = li.querySelector(':scope > a');
    if (!panel || !label) return;

    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-drop-trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `<span>${label.textContent}</span>`;
    trigger.dataset.href = label.getAttribute('href');
    label.replaceWith(trigger);

    panel.classList.add('nav-drop-panel');

    const setExpanded = (expanded) => {
      li.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };

    li.addEventListener('mouseenter', () => {
      if (isDesktop.matches) setExpanded(true);
    });
    li.addEventListener('mouseleave', () => {
      if (isDesktop.matches) setExpanded(false);
    });
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = li.getAttribute('aria-expanded') === 'true';
      if (!isDesktop.matches) closeAllDropdowns(list);
      setExpanded(!expanded);
    });
  });
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await fetchNav(navPath);

  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // unwrap default-content-wrappers so section > ul is a direct-child relationship
  nav.querySelectorAll('.default-content-wrapper').forEach((wrapper) => {
    wrapper.replaceWith(...wrapper.childNodes);
  });

  // the nav fragment produces 4 sections: brand, main nav, utility, locale
  const sections = nav.querySelectorAll(':scope > .section, :scope > div');
  const classes = ['brand', 'sections', 'utility', 'locale'];
  classes.forEach((c, i) => {
    if (sections[i]) sections[i].classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  const navUtility = nav.querySelector('.nav-utility');
  const navLocale = nav.querySelector('.nav-locale');

  if (navSections) {
    const list = navSections.querySelector(':scope > ul, .default-content-wrapper > ul');
    if (list) decorateNavList(list);
  }

  if (navUtility) {
    const list = navUtility.querySelector(':scope > ul, .default-content-wrapper > ul');
    if (list) {
      decorateNavList(list);
      list.querySelectorAll(':scope > li > a').forEach((a) => {
        if (/buy now/i.test(a.textContent)) a.classList.add('nav-cta');
        if (/sign in/i.test(a.textContent)) a.classList.add('nav-signin');
      });
    }
  }

  if (navLocale) {
    const list = navLocale.querySelector(':scope > ul, .default-content-wrapper > ul');
    if (list) {
      list.classList.add('nav-locale-list');
      const current = list.querySelector('li a');
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-locale-toggle';
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = current ? current.textContent : 'English';
      toggle.addEventListener('click', () => {
        const expanded = navLocale.getAttribute('aria-expanded') === 'true';
        navLocale.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      navLocale.setAttribute('aria-expanded', 'false');
      navLocale.prepend(toggle);
    }
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  const toggleMenu = (forceExpanded = null) => {
    const expanded = forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
    hamburger.querySelector('button').setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    if (expanded) closeAllDropdowns(nav);
  };
  hamburger.addEventListener('click', () => toggleMenu());
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // close desktop dropdowns when clicking outside the nav
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.contains(e.target)) closeAllDropdowns(nav);
  });

  // reset state when crossing the desktop/mobile breakpoint
  isDesktop.addEventListener('change', () => {
    closeAllDropdowns(nav);
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    hamburger.querySelector('button').setAttribute('aria-label', 'Open navigation');
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
