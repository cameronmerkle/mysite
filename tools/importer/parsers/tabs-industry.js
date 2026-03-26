/* eslint-disable */
/* global WebImporter */
/** Parser for tabs-industry. Base: tabs. Source: https://www.lumen.com/en-us/home.html. Generated: 2026-03-25 */
export default function parse(element, { document }) {
  // Source: .industrySelectorBlock .industry-selector-container
  // Dropdown options are industry names, each .industry-selector-item has case study content
  const dropdownOptions = element.querySelectorAll('.dropdown-option');
  const items = element.querySelectorAll('.industry-selector-item');
  const sharedImg = element.querySelector('.industry-selector-image img');
  const cells = [];

  items.forEach((item, index) => {
    // Tab label from dropdown option
    const optionEl = dropdownOptions[index];
    const labelText = optionEl ? optionEl.textContent.trim() : `Industry ${index + 1}`;

    // Case study content
    const title = item.querySelector('.industry-selector-title');
    const description = item.querySelector('.industry-selector-description');
    const cta = item.querySelector('.industry-selector-cta-link1');
    const industryName = item.querySelector('.industry-selector-industry-name');
    const location = item.querySelector('.industry-selector-industry-location');

    // Tabs block: col1 = industry name, col2 = image + case study details
    const contentCell = [];
    if (sharedImg && index === 0) contentCell.push(sharedImg.cloneNode(true));
    else if (sharedImg) contentCell.push(sharedImg.cloneNode(true));
    if (industryName && industryName.textContent.trim()) contentCell.push(industryName);
    if (location && location.textContent.trim()) contentCell.push(location);
    if (title) contentCell.push(title);
    if (description) contentCell.push(description);
    if (cta) contentCell.push(cta);

    cells.push([labelText, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-industry', cells });
  element.replaceWith(block);
}
