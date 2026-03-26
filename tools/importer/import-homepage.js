/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroEnterpriseParser from './parsers/hero-enterprise.js';
import cardsStatsParser from './parsers/cards-stats.js';
import tabsNumberedParser from './parsers/tabs-numbered.js';
import tabsIndustryParser from './parsers/tabs-industry.js';
import cardsSolutionsParser from './parsers/cards-solutions.js';
import cardsLogosParser from './parsers/cards-logos.js';
import cardsIndustryParser from './parsers/cards-industry.js';
import cardsSupportParser from './parsers/cards-support.js';

// TRANSFORMER IMPORTS
import lumenCleanupTransformer from './transformers/lumen-cleanup.js';
import lumenSectionsTransformer from './transformers/lumen-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-enterprise': heroEnterpriseParser,
  'cards-stats': cardsStatsParser,
  'tabs-numbered': tabsNumberedParser,
  'tabs-industry': tabsIndustryParser,
  'cards-solutions': cardsSolutionsParser,
  'cards-logos': cardsLogosParser,
  'cards-industry': cardsIndustryParser,
  'cards-support': cardsSupportParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Lumen Technologies homepage with hero, product/service offerings, and company information',
  urls: [
    'https://www.lumen.com/en-us/home.html'
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: '.herobanner.teaser',
      style: null,
      blocks: ['hero-enterprise'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Stats',
      selector: '.teasercontainer.teaser:has(.teaser-stat-tiles)',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: ['.teaser-stat-tiles > .cmp-teaser__content']
    },
    {
      id: 'section-3',
      name: 'Tabbed Features',
      selector: '.stackedContent',
      style: null,
      blocks: ['tabs-numbered'],
      defaultContent: []
    },
    {
      id: 'section-4',
      name: 'Industry Selector',
      selector: '.industrySelectorBlock',
      style: null,
      blocks: ['tabs-industry'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Solutions Cards',
      selector: '.teasercontainer.teaser:has(.teaser-cards-block)',
      style: 'dark',
      blocks: ['cards-solutions'],
      defaultContent: ['.teaser-cards-block > .cmp-teaser__content']
    },
    {
      id: 'section-6',
      name: 'Logo Bar',
      selector: '.partnerstory',
      style: null,
      blocks: ['cards-logos'],
      defaultContent: ['.partner-story-heading']
    },
    {
      id: 'section-7',
      name: 'Staggered Industry Cards',
      selector: '.teasercontainer.teaser:has(.teaser-staggered-cards)',
      style: 'dark',
      blocks: ['cards-industry'],
      defaultContent: []
    },
    {
      id: 'section-8',
      name: 'Support',
      selector: '.teasercontainer.teaser:has(.teaser-with-cards)',
      style: null,
      blocks: ['cards-support'],
      defaultContent: ['.teaser-with-cards > .cmp-teaser__content']
    }
  ],
  blocks: [
    {
      name: 'hero-enterprise',
      instances: ['.herobanner.teaser']
    },
    {
      name: 'cards-stats',
      instances: ['.teaser-stat-tiles .cards.wrapper']
    },
    {
      name: 'tabs-numbered',
      instances: ['.stackedContent .lumen-tabs']
    },
    {
      name: 'tabs-industry',
      instances: ['.industrySelectorBlock .industry-selector-container']
    },
    {
      name: 'cards-solutions',
      instances: ['.teaser-cards-block .cards.wrapper']
    },
    {
      name: 'cards-logos',
      instances: ['.partnerstory .carousel-group:first-child']
    },
    {
      name: 'cards-industry',
      instances: ['.teaser-staggered-cards .cards.wrapper']
    },
    {
      name: 'cards-support',
      instances: ['.teaser-with-cards .cards.wrapper']
    }
  ]
};

// TRANSFORMER REGISTRY
const transformers = [
  lumenCleanupTransformer,
  lumenSectionsTransformer,
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
