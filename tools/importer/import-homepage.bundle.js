/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    let slides = Array.from(
      element.querySelectorAll(".banner__content-item:not(.slick-cloned)")
    );
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".banner__content-item"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("picture img, img");
      const textWrap = slide.querySelector(".banner__content__text");
      const contentCell = [];
      if (textWrap) {
        const heading = textWrap.querySelector("h1, h2, h3");
        if (heading) contentCell.push(heading);
        const desc = textWrap.querySelector("span, p");
        if (desc) contentCell.push(desc);
        const ctas = Array.from(textWrap.querySelectorAll("a"));
        contentCell.push(...ctas);
      }
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "carousel-hero",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-feature.js
  function parse2(element, { document: document2 }) {
    const sectionTitle = element.querySelector("h1.section-title, h2.section-title, h3.section-title, h4.section-title, .section-title");
    if (sectionTitle && sectionTitle.textContent.trim()) {
      const heading = document2.createElement("h2");
      heading.textContent = sectionTitle.textContent.trim();
      element.parentNode.insertBefore(heading, element);
    }
    let slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned)"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".slick-slide"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".md-feature-carousel__img img, picture img, img");
      const titleEl = slide.querySelector(".title, h2, h3, h4, h5");
      const slideAnchor = slide.querySelector("a[href]");
      const href = slideAnchor ? slideAnchor.getAttribute("href") : null;
      const descEls = Array.from(
        slide.querySelectorAll(".body-text1, .md-feature-carousel__content p")
      );
      const contentCell = [];
      if (titleEl) {
        if (href) {
          const heading = document2.createElement(titleEl.tagName.toLowerCase());
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = titleEl.textContent.trim();
          heading.appendChild(a);
          contentCell.push(heading);
        } else {
          contentCell.push(titleEl);
        }
      } else if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = img && img.getAttribute("alt") || "Find out more";
        contentCell.push(a);
      }
      descEls.forEach((d) => {
        const t = d.textContent.trim();
        if (t && (!titleEl || t !== titleEl.textContent.trim())) {
          contentCell.push(d);
        }
      });
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "carousel-feature",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-quote.js
  function parse3(element, { document: document2 }) {
    let slides = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned)"));
    if (!slides.length) {
      slides = Array.from(element.querySelectorAll(".slick-slide"));
    }
    const cells = [];
    slides.forEach((slide) => {
      const quote = slide.querySelector(".message, .md-quote-carousel__message .message");
      const attribution = slide.querySelector(".body-text2");
      const contentCell = [];
      if (quote) contentCell.push(quote);
      if (attribution) contentCell.push(attribution);
      if (contentCell.length) {
        cells.push(["", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "carousel-quote",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-admission.js
  function parse4(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".md-admission-type__item"));
    const cells = [];
    items.forEach((item) => {
      const titleWrap = item.querySelector(".md-admission-type__title");
      const descWrap = item.querySelector(".md-admission-type__desc");
      const contentCell = [];
      if (titleWrap) {
        const link = titleWrap.querySelector("a[href]");
        const labelText = (titleWrap.textContent || "").trim();
        if (link) {
          const heading = document2.createElement("h3");
          const a = document2.createElement("a");
          a.href = link.getAttribute("href");
          a.textContent = labelText;
          heading.appendChild(a);
          contentCell.push(heading);
        } else if (labelText) {
          const heading = document2.createElement("h3");
          heading.textContent = labelText;
          contentCell.push(heading);
        }
      }
      if (descWrap) {
        const p = descWrap.querySelector("p") || descWrap;
        contentCell.push(p);
      }
      if (contentCell.length) {
        cells.push([contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-admission",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function parse5(element, { document: document2 }) {
    const sectionTitle = element.querySelector("h1.section-title, h2.section-title, h3.section-title, h4.section-title, .section-title");
    if (sectionTitle && sectionTitle.textContent.trim()) {
      const heading = document2.createElement("h2");
      heading.textContent = sectionTitle.textContent.trim();
      element.parentNode.insertBefore(heading, element);
    }
    let items = Array.from(element.querySelectorAll(".md-4-col-content-fragment__item"));
    let variant = "fragment";
    if (!items.length) {
      items = Array.from(element.querySelectorAll(".slick-slide:not(.slick-cloned)"));
      if (!items.length) items = Array.from(element.querySelectorAll(".slick-slide"));
      variant = "carousel";
    }
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector(".md-feature-carousel__img img, img, picture img");
      const contentCell = [];
      const heading = item.querySelector(
        ".all-content h2, .all-content h3, .all-content h4, .title, h2, h3, h4"
      );
      if (heading) contentCell.push(heading);
      const desc = item.querySelector(".body-text3, .body-text1, .all-content p");
      if (desc) contentCell.push(desc);
      const anchor = item.querySelector("a[href]");
      if (anchor) {
        const labelEl = anchor.querySelector(".md-link-with-arrow");
        let label = labelEl ? labelEl.textContent.trim() : "";
        if (!label) {
          label = variant === "carousel" ? heading ? heading.textContent.trim() : "Find out more" : anchor.textContent.trim();
        }
        const a = document2.createElement("a");
        a.href = anchor.getAttribute("href");
        a.textContent = label || "Explore More";
        contentCell.push(a);
      }
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-tile",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-itinerary.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".animals-item"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img, picture img");
      const anchor = item.querySelector("a[href]");
      const href = anchor ? anchor.getAttribute("href") : null;
      const contentCell = [];
      const heading = item.querySelector(".desc h2, .desc h3, .desc h4, h2, h3, h4");
      const desc = item.querySelector(".desc p, p");
      if (heading) contentCell.push(heading);
      if (desc) contentCell.push(desc);
      if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = heading ? heading.textContent.trim() : "Find out more";
        contentCell.push(a);
      }
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-itinerary",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-social.js
  function parse7(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll(".social-grid-component__column.photo"));
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("img, picture img");
      const anchor = item.querySelector("a[href]");
      const href = anchor ? anchor.getAttribute("href") : null;
      const handleEl = item.querySelector(".body-text2, .social-grid-component__username");
      const handle = handleEl ? handleEl.textContent.trim() : "";
      const contentCell = [];
      if (href) {
        const a = document2.createElement("a");
        a.href = href;
        a.textContent = handle || "View post";
        contentCell.push(a);
      } else if (handle) {
        const p = document2.createElement("p");
        p.textContent = handle;
        contentCell.push(p);
      }
      if (img || contentCell.length) {
        cells.push([img || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-social",
      cells
    });
    const titleEl = element.querySelector(".social-grid-component__title h2, .social-grid-component__title h3, .social-grid-component__title h4");
    if (titleEl) {
      element.replaceWith(titleEl, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/tabs-guide.js
  function parse8(element, { document: document2 }) {
    const topHeading = Array.from(element.querySelectorAll("h1, h2, h3")).find((h) => !h.closest(".tab_item") && h.textContent.trim());
    if (topHeading) {
      const heading = document2.createElement("h2");
      heading.textContent = topHeading.textContent.trim();
      element.parentNode.insertBefore(heading, element);
    }
    const tabs = Array.from(element.querySelectorAll(".tab_item"));
    const cells = [];
    tabs.forEach((tab) => {
      const labelEl = tab.querySelector(".tab_btn-tab, button");
      const label = labelEl ? labelEl.textContent.trim() : "";
      const contentCell = [];
      const heading = tab.querySelector(".tab_info-content_header, h2, h3, h4");
      if (heading) contentCell.push(heading);
      const descWrap = tab.querySelector(".tab_info-content_description");
      if (descWrap) {
        const ps = Array.from(descWrap.querySelectorAll("p"));
        if (ps.length) contentCell.push(...ps);
        else contentCell.push(descWrap);
      }
      const img = tab.querySelector(".tab_info-image, img, picture img");
      if (img) contentCell.push(img);
      const link = tab.querySelector(".tab_info-content_link, a[href]");
      if (link) {
        const a = document2.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = (link.textContent || "").trim() || "Explore More";
        contentCell.push(a);
      }
      if (label || contentCell.length) {
        const labelCell = document2.createElement("p");
        labelCell.textContent = label;
        cells.push([labelCell, contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "tabs-guide",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-awards.js
  function parse9(element, { document: document2 }) {
    const columns = Array.from(element.querySelectorAll(".col-block"));
    const row = [];
    columns.forEach((col) => {
      const cell = [];
      const img = col.querySelector(".cmp-image__image, img, picture img");
      if (img) cell.push(img);
      const caption = col.querySelector(".cmp-image__title");
      if (caption) {
        const p = document2.createElement("p");
        p.textContent = caption.textContent.trim();
        cell.push(p);
      }
      if (cell.length) row.push(cell);
    });
    if (!row.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "columns-awards",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/mandai-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".slick-cloned"]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "#sleekflow-widget-container"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        ".headerv2",
        "footer",
        ".footerv2",
        ".md-back-to-top",
        ".ui-helper-hidden-accessible",
        "noscript",
        "iframe",
        "link",
        "style",
        "script"
      ]);
    }
  }

  // tools/importer/transformers/mandai-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "carousel-feature": parse2,
    "carousel-quote": parse3,
    "cards-admission": parse4,
    "cards-tile": parse5,
    "cards-itinerary": parse6,
    "cards-social": parse7,
    "tabs-guide": parse8,
    "columns-awards": parse9
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Mandai Wildlife Reserve homepage",
    urls: [
      "https://www.mandai.com/en.html"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".mandaimastheadcarousel .md-masthead-component.banner__carousel"]
      },
      {
        name: "carousel-feature",
        instances: [
          ".mandaifeaturecarousel .md-feature-carousel.bg-dark-green",
          ".mandaiexperiencecarouselfeature .md-feature-carousel-experience",
          "#animals.md-feature-carousel"
        ]
      },
      {
        name: "cards-admission",
        instances: [".admissiontypeswidget"]
      },
      {
        name: "cards-tile",
        instances: [
          ".mandaicffourcollisting .md-4-col-content-fragment",
          "#dineshop.md-feature-carousel"
        ]
      },
      {
        name: "cards-itinerary",
        instances: [".featuredlistingv2"]
      },
      {
        name: "tabs-guide",
        instances: ["#visitorguide.md-accordion-tabs"]
      },
      {
        name: "columns-awards",
        instances: [".columncontrol .column-control-blocks"]
      },
      {
        name: "cards-social",
        instances: [".mandaisocialcontentgrid"]
      },
      {
        name: "carousel-quote",
        instances: [".mandaiquotecarousel .md-quote-carousel"]
      }
    ],
    sections: [
      { id: "rc3", name: "Hero Masthead Carousel", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.mandaimastheadcarousel.parsys.aem-GridColumn.aem-GridColumn--default--12", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "rc4", name: "What's New", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(3)", style: "dark-green", blocks: ["carousel-feature", "cards-admission"], defaultContent: [] },
      { id: "rc5", name: "A Wilder World Awaits", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(4)", style: "beige", blocks: ["cards-tile", "carousel-feature"], defaultContent: [] },
      { id: "rc6", name: "A Wilder Way to Eat and Shop", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(5)", style: "beige", blocks: ["cards-tile"], defaultContent: [] },
      { id: "rc7", name: "Too Wild To Miss Itineraries", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(6)", style: "beige", blocks: ["cards-itinerary"], defaultContent: [] },
      { id: "rc8", name: "Meet our animal residents", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(7)", style: "grass-image", blocks: ["carousel-feature"], defaultContent: [] },
      { id: "rc9", name: "Visitor Guide", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(8)", style: "beige", blocks: ["tabs-guide"], defaultContent: [] },
      { id: "rc10", name: "Awards", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.parsys.aem-GridColumn.aem-GridColumn--default--12:nth-of-type(9)", style: "beige", blocks: ["columns-awards"], defaultContent: [] },
      { id: "rc11", name: "Social Grid & Guest Reviews", selector: "body > main > div.container > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.aside.parsys.aem-GridColumn.aem-GridColumn--default--12", style: "beige", blocks: ["cards-social", "carousel-quote"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
