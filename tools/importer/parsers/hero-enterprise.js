/* eslint-disable */
/* global WebImporter */
/** Parser for hero-enterprise. Base: hero. Source: https://www.lumen.com/en-us/home.html. Generated: 2026-03-25 */
export default function parse(element, { document }) {
  // Source: .herobanner.teaser > .cmp-teaser
  const teaser = element.querySelector('.cmp-teaser') || element;

  // Extract image from .cmp-teaser__image picture > img
  const img = teaser.querySelector('.cmp-teaser__image img');

  // Extract heading from .cmp-teaser__title (h1)
  const heading = teaser.querySelector('.cmp-teaser__title');

  // Extract description from .cmp-teaser__description
  const description = teaser.querySelector('.cmp-teaser__description');

  // Extract CTAs from .cmp-teaser__action-container a
  const ctas = Array.from(teaser.querySelectorAll('.cmp-teaser__action-container a'));

  // Build cells: Row 1 = image, Row 2 = heading + description + CTAs
  const cells = [];

  // Row 1: Background image (optional)
  if (img) {
    cells.push([img]);
  }

  // Row 2: Content (heading + description + CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctas);
  cells.push(contentCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-enterprise', cells });
  element.replaceWith(block);
}
