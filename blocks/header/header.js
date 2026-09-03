import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

// inline icons used by the top-bar tools
const ICONS = {
  globe: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18M3.5 9h17M3.5 15h17"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.6" d="m20 20-3.5-3.5M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"/></svg>',
};

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

  // pull Sign in + Buy Now out of the utility list; they belong on the right,
  // matching the source (Sign in in the top tools group, Buy Now on the nav row)
  let signinLink = null;
  let ctaLink = null;
  if (navUtility) {
    const list = navUtility.querySelector(':scope > ul, .default-content-wrapper > ul');
    if (list) {
      list.querySelectorAll(':scope > li > a').forEach((a) => {
        if (/buy now/i.test(a.textContent)) ctaLink = a;
        if (/sign in/i.test(a.textContent)) signinLink = a;
      });
      // remove their <li> wrappers from the utility list
      [signinLink, ctaLink].forEach((a) => { if (a) a.closest('li').remove(); });
      decorateNavList(list);
    }
  }

  if (navSections) {
    const list = navSections.querySelector(':scope > ul, .default-content-wrapper > ul');
    if (list) decorateNavList(list);
    // place the Buy Now CTA at the end of the main nav row
    if (ctaLink) {
      ctaLink.className = 'nav-cta';
      navSections.append(ctaLink);
    }
  }

  // build the top-right tools group: language selector + Sign in + Search
  if (navLocale) {
    const list = navLocale.querySelector(':scope > ul, .default-content-wrapper > ul');
    let localeToggle = null;
    if (list) {
      list.classList.add('nav-locale-list');
      const current = list.querySelector('li a');
      localeToggle = document.createElement('button');
      localeToggle.type = 'button';
      localeToggle.className = 'nav-locale-toggle';
      localeToggle.setAttribute('aria-haspopup', 'true');
      localeToggle.setAttribute('aria-expanded', 'false');
      localeToggle.innerHTML = `${ICONS.globe}<span>${current ? current.textContent : 'English'}</span>`;
      localeToggle.addEventListener('click', () => {
        const expanded = navLocale.getAttribute('aria-expanded') === 'true';
        navLocale.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        localeToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      navLocale.setAttribute('aria-expanded', 'false');
      navLocale.prepend(localeToggle);
    }

    // Sign in (icon + label) moves into the tools group
    if (signinLink) {
      signinLink.classList.add('nav-signin');
      signinLink.innerHTML = `${ICONS.user}<span>${signinLink.textContent}</span>`;
      navLocale.append(signinLink);
    }

    // Search trigger (icon + label), built in JS since it has no fragment content
    const search = document.createElement('button');
    search.type = 'button';
    search.className = 'nav-search';
    search.setAttribute('aria-label', 'Search');
    search.innerHTML = `${ICONS.search}<span>Search</span>`;
    navLocale.append(search);
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
