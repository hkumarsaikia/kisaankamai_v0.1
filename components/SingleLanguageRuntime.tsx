"use client";

import { useLanguage } from "@/components/LanguageContext";
import { useEffect, useRef } from "react";

const DEVANAGARI_REGEX = /\p{Script=Devanagari}/u;
const LATIN_REGEX = /[A-Za-z]/;
const NON_TRANSLATABLE_VALUE_REGEX = /^[\d\s()[\]+\-–—.,:/%₹#@&*_=<>!?'"`~\\|]+$/;
const SKIPPED_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "IFRAME",
  "CANVAS",
  "SVG",
  "PATH",
  "META",
  "HEAD",
  "LINK",
  "CODE",
  "PRE",
]);
const BASE_TRANSLATABLE_ATTRIBUTES = ["placeholder", "title", "aria-label", "alt"] as const;
const textNodeSources = new WeakMap<Text, string>();
const textNodeRenderedValues = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
const attributeRenderedValues = new WeakMap<Element, Map<string, string>>();

function containsDevanagari(value: string) {
  return DEVANAGARI_REGEX.test(value);
}

function containsLatin(value: string) {
  return LATIN_REGEX.test(value);
}

function extractInlineLocalizedText(value: string) {
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return null;
  }

  const delimiterCandidates = [" / ", " | ", "\n"];

  for (const delimiter of delimiterCandidates) {
    const segments = normalizedValue
      .split(delimiter)
      .map((segment) => segment.trim())
      .filter(Boolean);

    if (segments.length !== 2) {
      continue;
    }

    const [firstSegment, secondSegment] = segments;
    const firstHasDevanagari = containsDevanagari(firstSegment);
    const secondHasDevanagari = containsDevanagari(secondSegment);
    const firstHasLatin = containsLatin(firstSegment);
    const secondHasLatin = containsLatin(secondSegment);

    if (firstHasDevanagari && !secondHasDevanagari && secondHasLatin) {
      return { en: secondSegment, mr: firstSegment };
    }

    if (secondHasDevanagari && !firstHasDevanagari && firstHasLatin) {
      return { en: firstSegment, mr: secondSegment };
    }
  }

  return null;
}

function isTranslatableValue(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return false;
  }

  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmedValue)) {
    return false;
  }

  if (NON_TRANSLATABLE_VALUE_REGEX.test(trimmedValue)) {
    return false;
  }

  if (extractInlineLocalizedText(trimmedValue)) {
    return true;
  }

  return containsLatin(trimmedValue) || containsDevanagari(trimmedValue);
}

function shouldSkipElement(element: Element | null) {
  if (!element) {
    return true;
  }

  if (SKIPPED_TAGS.has(element.tagName)) {
    return true;
  }

  if (element.closest("[data-no-auto-translate='true'], [translate='no'], .material-symbols-outlined")) {
    return true;
  }

  return false;
}

function getTranslatableAttributeNames(element: Element) {
  const attributeNames: string[] = [...BASE_TRANSLATABLE_ATTRIBUTES];

  if (
    element instanceof HTMLInputElement &&
    ["button", "submit", "reset"].includes(element.type)
  ) {
    attributeNames.push("value");
  }

  return attributeNames;
}

function readAttributeMap(
  cache: WeakMap<Element, Map<string, string>>,
  element: Element
) {
  const existing = cache.get(element);
  if (existing) {
    return existing;
  }

  const next = new Map<string, string>();
  cache.set(element, next);
  return next;
}

export function SingleLanguageRuntime() {
  const { language, text, translateText } = useLanguage();
  const revisionRef = useRef(0);

  useEffect(() => {
    revisionRef.current += 1;
    const currentRevision = revisionRef.current;
    const root = document.body;

    if (!root) {
      return;
    }

    const processTextNode = (node: Text) => {
      const parentElement = node.parentElement;
      if (!parentElement || shouldSkipElement(parentElement)) {
        return;
      }

      const currentValue = node.textContent || "";
      const previousSource = textNodeSources.get(node);
      const previousRendered = textNodeRenderedValues.get(node);

      const sourceValue =
        !previousSource || (currentValue !== previousSource && currentValue !== previousRendered)
          ? currentValue
          : previousSource;

      textNodeSources.set(node, sourceValue);

      if (!isTranslatableValue(sourceValue)) {
        textNodeRenderedValues.delete(node);
        return;
      }

      const immediateValue = text(sourceValue);
      if (currentValue !== immediateValue) {
        node.textContent = immediateValue;
      }
      textNodeRenderedValues.set(node, immediateValue);

      void translateText(sourceValue).then((translatedValue) => {
        if (
          revisionRef.current !== currentRevision ||
          !node.isConnected ||
          textNodeSources.get(node) !== sourceValue
        ) {
          return;
        }

        if (node.textContent !== translatedValue) {
          node.textContent = translatedValue;
        }
        textNodeRenderedValues.set(node, translatedValue);
      });
    };

    const processAttribute = (element: Element, attributeName: string) => {
      if (shouldSkipElement(element) || !element.hasAttribute(attributeName)) {
        return;
      }

      const currentValue = element.getAttribute(attributeName) || "";
      const sourceMap = readAttributeMap(attributeSources, element);
      const renderedMap = readAttributeMap(attributeRenderedValues, element);
      const previousSource = sourceMap.get(attributeName);
      const previousRendered = renderedMap.get(attributeName);

      const sourceValue =
        !previousSource || (currentValue !== previousSource && currentValue !== previousRendered)
          ? currentValue
          : previousSource;

      sourceMap.set(attributeName, sourceValue);

      if (!isTranslatableValue(sourceValue)) {
        renderedMap.delete(attributeName);
        return;
      }

      const immediateValue = text(sourceValue);
      if (currentValue !== immediateValue) {
        element.setAttribute(attributeName, immediateValue);
      }
      renderedMap.set(attributeName, immediateValue);

      void translateText(sourceValue).then((translatedValue) => {
        if (
          revisionRef.current !== currentRevision ||
          !element.isConnected ||
          attributeSources.get(element)?.get(attributeName) !== sourceValue
        ) {
          return;
        }

        if (element.getAttribute(attributeName) !== translatedValue) {
          element.setAttribute(attributeName, translatedValue);
        }
        readAttributeMap(attributeRenderedValues, element).set(attributeName, translatedValue);
      });
    };

    const processElement = (element: Element) => {
      if (shouldSkipElement(element)) {
        return;
      }

      for (const attributeName of getTranslatableAttributeNames(element)) {
        processAttribute(element, attributeName);
      }
    };

    const processSubtree = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        processTextNode(node as Text);
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      const element = node as Element;
      processElement(element);

      const descendants = element.querySelectorAll("*");
      descendants.forEach(processElement);

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let currentNode = walker.nextNode();
      while (currentNode) {
        processTextNode(currentNode as Text);
        currentNode = walker.nextNode();
      }
    };

    processSubtree(root);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          processTextNode(mutation.target as Text);
          continue;
        }

        if (mutation.type === "attributes") {
          processAttribute(mutation.target as Element, mutation.attributeName || "");
          continue;
        }

        mutation.addedNodes.forEach(processSubtree);
      }
    });

    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...BASE_TRANSLATABLE_ATTRIBUTES, "value"],
    });

    return () => observer.disconnect();
  }, [language, text, translateText]);

  return null;
}
