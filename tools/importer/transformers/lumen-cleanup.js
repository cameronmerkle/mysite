/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: lumen cleanup.
 * Removes non-authorable content from Lumen pages.
 * Selectors from captured DOM of https://www.lumen.com/en-us/home.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Cookie consent banner (found: #onetrust-consent-sdk at line 4564)
    // Page loader overlay (found: .loaderbox at line 32)
    // Warning/error notification divs (found: .warningDiv at line 37)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.loaderbox',
      '.warningDiv',
    ]);
  }

  if (hookName === H.after) {
    // Navigation header (found: .is-navigation-sticky at line 7, header.header-v2 at line 58)
    // Footer (found: footer.experiencefragment at line 3127)
    // Breadcrumb (found: .cmp-header__breadcrumb at line 2175)
    // Carousel dots (found: .carousel-dots, non-authorable navigation UI)
    // Environment mode setting (found: #env-run-mode-setting at line 2)
    WebImporter.DOMUtils.remove(element, [
      '.is-navigation-sticky',
      'footer',
      '.cmp-header__breadcrumb',
      '.carousel-dots',
      '#env-run-mode-setting',
      'noscript',
      'iframe',
      'link',
    ]);

    // Clean tracking and AEM-specific attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });
  }
}
