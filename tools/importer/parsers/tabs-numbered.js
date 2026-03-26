/* eslint-disable */
/* global WebImporter */
/** Parser for tabs-numbered. Base: tabs. Source: https://www.lumen.com/en-us/home.html. Generated: 2026-03-25 */
export default function parse(element, { document }) {
  // Source: .stackedContent .lumen-tabs
  // Each article.lumen-tabs__panel has tab number, image, title, description, CTA
  const panels = element.querySelectorAll('article.lumen-tabs__panel');
  const cells = [];

  panels.forEach((panel, index) => {
    // Tab label - use index since each panel contains ALL tab buttons
    // and querySelector would always return the first (01)
    const labelText = String(index + 1).padStart(2, '0');

    // Image
    const img = panel.querySelector('.lumen-tabs__imageWrap img');

    // Title
    const title = panel.querySelector('.lumen-tabs__title');

    // Description
    const desc = panel.querySelector('.lumen-tabs__desc');

    // CTA
    const cta = panel.querySelector('.lumen-tabs__cta');

    // Tabs block: col1 = tab label, col2 = image + title + description + CTA
    const contentCell = [];
    if (img) contentCell.push(img);
    if (title) contentCell.push(title);
    if (desc) contentCell.push(desc);
    if (cta) contentCell.push(cta);

    cells.push([labelText, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-numbered', cells });
  element.replaceWith(block);
}
