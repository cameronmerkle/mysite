/* eslint-disable */
/* global WebImporter */
/** Parser for cards-stats. Base: cards. Source: https://www.lumen.com/en-us/home.html. Generated: 2026-03-25 */
export default function parse(element, { document }) {
  // Source: .teaser-stat-tiles .cards.wrapper
  // Each .card contains a .cmp-teaser with pretitle (stat number), title, description, CTA, and image
  const cards = element.querySelectorAll(':scope > .card');
  const cells = [];

  cards.forEach((card) => {
    const teaser = card.querySelector('.cmp-teaser') || card;

    // Image from .cmp-teaser__image img
    const img = teaser.querySelector('.cmp-teaser__image img');

    // Pretitle (stat number like 10x, 97%)
    const pretitle = teaser.querySelector('.cmp-teaser__pretitle');

    // Title
    const title = teaser.querySelector('.cmp-teaser__title');

    // Description
    const description = teaser.querySelector('.cmp-teaser__description');

    // CTA links
    const ctas = Array.from(teaser.querySelectorAll('.cmp-teaser__action-container a'));

    // Cards block: col1 = image, col2 = pretitle + title + description + CTAs
    const imageCell = img ? img : '';
    const contentCell = [];
    if (pretitle) contentCell.push(pretitle);
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    contentCell.push(...ctas);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
