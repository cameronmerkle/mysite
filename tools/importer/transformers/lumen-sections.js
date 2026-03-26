/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: lumen sections.
 * Adds section breaks (<hr>) and section-metadata blocks based on template sections.
 * Runs in afterTransform only. Uses payload.template.sections.
 * Selectors from captured DOM of https://www.lumen.com/en-us/home.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const doc = element.ownerDocument || document;

    // Process sections in reverse order to avoid offset issues
    const sections = [...template.sections].reverse();

    for (const section of sections) {
      // Find the first element matching the section selector
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionEl = null;
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) continue;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add <hr> before section (except first section)
      const isFirst = section.id === template.sections[0].id;
      if (!isFirst) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
