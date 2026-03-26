/* eslint-disable */
/* global WebImporter */
/** Parser for cards-support. Base: cards. Source: https://www.lumen.com/en-us/home.html. Generated: 2026-03-25 */
export default function parse(element, { document }) {
  // Source: .teaser-with-cards .cards.wrapper
  // Each .card contains a .cmp-teaser with icon image, title, description, and CTA
  const cards = element.querySelectorAll(':scope > .card');
  const cells = [];

  cards.forEach((card) => {
    const teaser = card.querySelector('.cmp-teaser') || card;

    // Icon image
    const img = teaser.querySelector('.cmp-teaser__image img');

    // Title
    const title = teaser.querySelector('.cmp-teaser__title');

    // Description
    const description = teaser.querySelector('.cmp-teaser__description');

    // CTA links
    const ctas = Array.from(teaser.querySelectorAll('.cmp-teaser__action-container a'));

    // Cards block: col1 = icon image, col2 = title + description + CTAs
    const imageCell = img ? img : '';
    const contentCell = [];
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-support', cells });
  element.replaceWith(block);
}
