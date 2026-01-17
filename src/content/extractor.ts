const EXCLUDED_TAGS = new Set([
  'script',
  'style',
  'noscript',
  'iframe',
  'nav',
  'footer',
  'aside',
  'header',
  'form',
  'button',
  'input',
  'select',
  'textarea',
]);

const AD_SELECTORS = [
  '[class*="ad-"]',
  '[class*="ads-"]',
  '[class*="advertisement"]',
  '[id*="ad-"]',
  '[id*="ads-"]',
  '[data-ad]',
  '.sponsored',
  '.promotion',
  '[aria-label*="advertisement"]',
];

const MAIN_CONTENT_SELECTORS = [
  'article',
  'main',
  '[role="main"]',
  '.post-content',
  '.article-content',
  '.entry-content',
  '.content',
  '#content',
  '.post',
  '.article',
];

export interface ExtractedContent {
  text: string;
  title: string;
  url: string;
}

export function extractPageContent(): ExtractedContent {
  const title = document.title || '';
  const url = window.location.href;

  // Try to find main content area
  let mainElement = findMainContent();

  if (!mainElement) {
    // Fallback: find the element with most text content
    mainElement = findLargestTextContainer();
  }

  if (!mainElement) {
    mainElement = document.body;
  }

  const text = extractTextFromElement(mainElement);

  return {
    text: cleanText(text),
    title,
    url,
  };
}

function findMainContent(): Element | null {
  for (const selector of MAIN_CONTENT_SELECTORS) {
    const element = document.querySelector(selector);
    if (element && hasSignificantText(element)) {
      return element;
    }
  }
  return null;
}

function findLargestTextContainer(): Element | null {
  const candidates: Array<{ element: Element; textLength: number }> = [];

  const divs = document.querySelectorAll('div, section');
  divs.forEach((div) => {
    const textLength = getDirectTextLength(div);
    if (textLength > 200) {
      candidates.push({ element: div, textLength });
    }
  });

  if (candidates.length === 0) return null;

  // Sort by text length and return the largest
  candidates.sort((a, b) => b.textLength - a.textLength);
  return candidates[0].element;
}

function hasSignificantText(element: Element): boolean {
  const text = element.textContent || '';
  return text.trim().length > 100;
}

function getDirectTextLength(element: Element): number {
  let length = 0;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;

    if (parent && !shouldExcludeElement(parent)) {
      length += (node.textContent || '').trim().length;
    }
  }

  return length;
}

function shouldExcludeElement(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();

  if (EXCLUDED_TAGS.has(tagName)) {
    return true;
  }

  // Check for ad elements
  for (const selector of AD_SELECTORS) {
    try {
      if (element.matches(selector)) {
        return true;
      }
    } catch {
      // Invalid selector, skip
    }
  }

  // Check if hidden
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return true;
  }

  return false;
}

function extractTextFromElement(element: Element): string {
  const textParts: string[] = [];

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);

  while (walker.nextNode()) {
    const node = walker.currentNode;

    if (node.nodeType === Node.TEXT_NODE) {
      const parent = node.parentElement;
      if (parent && !shouldExcludeElement(parent)) {
        const text = (node.textContent || '').trim();
        if (text) {
          textParts.push(text);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();

      // Add line breaks for block elements
      if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'br', 'tr'].includes(tagName)) {
        textParts.push('\n');
      }
    }
  }

  return textParts.join(' ');
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Multiple spaces to single
    .replace(/\n\s*\n/g, '\n\n') // Multiple newlines to double
    .replace(/^\s+|\s+$/gm, '') // Trim each line
    .trim();
}
