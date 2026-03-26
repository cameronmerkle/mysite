/* eslint-disable */
/* global WebImporter */
/** Parser for cards-logos. Base: cards. Source: https://www.lumen.com/en-us/home.html. Generated: 2026-03-25 */
export default function parse(element, { document }) {
  // Source: .partnerstory .carousel-group:first-child
  // Each child div contains a single logo img
  const logoContainers = element.querySelectorAll(':scope > div');
  const cells = [];

  logoContainers.forEach((container) => {
    const img = container.querySelector('img');
    if (img) {
      // Cards (no images variant): single column with just the logo image
      cells.push([img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-logos', cells });
  element.replaceWith(block);
}
