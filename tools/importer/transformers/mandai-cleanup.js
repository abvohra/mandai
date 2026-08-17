/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: mandai site-wide cleanup.
 * All selectors verified against migration-work/cleaned.html (Mandai homepage DOM).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Slick carousel injects duplicated slides (infinite-scroll clones) marked
    // .slick-cloned. Verified in cleaned.html (e.g. lines 1586, 1728, 1960, 2360,
    // 2747). Remove before parsing so carousel/cards parsers don't extract dupes.
    WebImporter.DOMUtils.remove(element, ['.slick-cloned']);

    // Tracking iframes (DoubleClick / floodlight) and chat widget container.
    // Verified: iframes at lines 3144-3153, #sleekflow-widget-container at 3154.
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      '#sleekflow-widget-container',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Verified in cleaned.html:
    // - header: .headerv2 / <header class="md-header"> (lines 9-10, mega-menu nav)
    // - footer: .footerv2 / <footer class="md-footer"> (lines 2822, 2843)
    // - back-to-top floating widget: .md-back-to-top (line 2816)
    // - accessibility helper leftover: .ui-helper-hidden-accessible (line 3146)
    WebImporter.DOMUtils.remove(element, [
      'header',
      '.headerv2',
      'footer',
      '.footerv2',
      '.md-back-to-top',
      '.ui-helper-hidden-accessible',
      'noscript',
      'iframe',
      'link',
      'style',
      'script',
    ]);
  }
}
