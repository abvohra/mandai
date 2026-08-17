/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import carouselFeatureParser from './parsers/carousel-feature.js';
import carouselQuoteParser from './parsers/carousel-quote.js';
import cardsAdmissionParser from './parsers/cards-admission.js';
import cardsTileParser from './parsers/cards-tile.js';
import cardsItineraryParser from './parsers/cards-itinerary.js';
import cardsSocialParser from './parsers/cards-social.js';
import tabsGuideParser from './parsers/tabs-guide.js';
import columnsAwardsParser from './parsers/columns-awards.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/mandai-cleanup.js';
import sectionsTransformer from './transformers/mandai-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'carousel-feature': carouselFeatureParser,
  'carousel-quote': carouselQuoteParser,
  'cards-admission': cardsAdmissionParser,
  'cards-tile': cardsTileParser,
  'cards-itinerary': cardsItineraryParser,
  'cards-social': cardsSocialParser,
  'tabs-guide': tabsGuideParser,
  'columns-awards': columnsAwardsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Mandai Wildlife Reserve homepage',
  urls: [
    'https://www.mandai.com/en.html',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.mandaimastheadcarousel .md-masthead-component.banner__carousel'],
    },
    {
      name: 'carousel-feature',
      instances: [
        '.mandaifeaturecarousel .md-feature-carousel.bg-dark-green',
        '.mandaiexperiencecarouselfeature .md-feature-carousel-experience',
        '#animals.md-feature-carousel',
      ],
    },
    {
      name: 'cards-admission',
      instances: ['.admissiontypeswidget'],
    },
    {
      name: 'cards-tile',
      instances: [
        '.mandaicffourcollisting .md-4-col-content-fragment',
        '#dineshop.md-feature-carousel',
      ],
    },
    {
      name: 'cards-itinerary',
      instances: ['.featuredlistingv2'],
    },
    {
      name: 'tabs-guide',
      instances: ['#visitorguide.md-accordion-tabs'],
    },
    {
      name: 'columns-awards',
      instances: ['.columncontrol .column-control-blocks'],
    },
    {
      name: 'cards-social',
      instances: ['.mandaisocialcontentgrid'],
    },
    {
      name: 'carousel-quote',
      instances: ['.mandaiquotecarousel .md-quote-carousel'],
    },
  ],
  sections: [
    { id: 'rc3', name: 'Hero Masthead Carousel', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.mandaimastheadcarousel.parsys.aem-GridColumn.aem-GridColumn--default--12', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'rc4', name: "What's New", selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)', style: 'dark-green', blocks: ['carousel-feature', 'cards-admission'], defaultContent: [] },
    { id: 'rc5', name: 'A Wilder World Awaits', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(4)', style: 'beige', blocks: ['cards-tile', 'carousel-feature'], defaultContent: [] },
    { id: 'rc6', name: 'A Wilder Way to Eat and Shop', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(5)', style: 'beige', blocks: ['cards-tile'], defaultContent: [] },
    { id: 'rc7', name: 'Too Wild To Miss Itineraries', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)', style: 'beige', blocks: ['cards-itinerary'], defaultContent: [] },
    { id: 'rc8', name: 'Meet our animal residents', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(7)', style: 'grass-image', blocks: ['carousel-feature'], defaultContent: [] },
    { id: 'rc9', name: 'Visitor Guide', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(8)', style: 'beige', blocks: ['tabs-guide'], defaultContent: [] },
    { id: 'rc10', name: 'Awards', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(9)', style: 'beige', blocks: ['columns-awards'], defaultContent: [] },
    { id: 'rc11', name: 'Social Grid & Guest Reviews', selector: 'body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aside.parsys.aem-GridColumn.aem-GridColumn--default--12', style: 'beige', blocks: ['cards-social', 'carousel-quote'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then sections (sections need >1 section)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
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
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root/homepage to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

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
