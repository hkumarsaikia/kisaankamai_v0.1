#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const annotations = require(path.join(__dirname, "annotations.js"));

const ROOT_DIR = path.resolve(__dirname, "..", "..");
const APP_DIR = path.join(ROOT_DIR, "app");
const COMPONENTS_DIR = path.join(ROOT_DIR, "components");
const LIB_DIR = path.join(ROOT_DIR, "lib");
const OUTPUT_FILE = path.join(__dirname, "map-data.js");
const TUNNEL_LOG_FILE = path.join(ROOT_DIR, "tunnel.log");
const RELEVANT_COMPONENTS = new Set([
  "Header",
  "Footer",
  "OwnerSidebar",
  "OwnerTopBar",
  "RenterSidebar",
  "RenterTopBar",
  "LanguageToggle",
  "ThemeToggle",
  "MapComponent"
]);
const SKIP_INTERNAL_PREFIXES = ["/assets/", "/stitch-assets/"];
const SKIP_INTERNAL_SUFFIXES = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico", ".css", ".js", ".json"];
const LEGACY_ROUTE_PREFIXES = ["owner-dashboard", "renter-dashboard"];

function toPosix(targetPath) {
  return targetPath.split(path.sep).join("/");
}

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const output = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      output.push(...walk(fullPath));
      continue;
    }

    output.push(fullPath);
  }

  return output;
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function isLegacyRouteFile(filePath) {
  const relativePath = toPosix(path.relative(APP_DIR, filePath));
  return LEGACY_ROUTE_PREFIXES.some(
    (prefix) => relativePath === `${prefix}/page.tsx` || relativePath.startsWith(`${prefix}/`)
  );
}

function normalizeRoute(route) {
  if (!route || route === "/") {
    return "/";
  }

  const withoutHash = route.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  const withoutTrailingSlash = withoutQuery.replace(/\/+$/, "");

  return withoutTrailingSlash || "/";
}

function routeFromPageFile(filePath) {
  const relativePath = toPosix(path.relative(APP_DIR, filePath));
  if (relativePath === "page.tsx") {
    return "/";
  }

  return normalizeRoute(`/${relativePath.replace(/\/page\.tsx$/, "")}`);
}

function scopeFromLayoutFile(filePath) {
  const relativePath = toPosix(path.relative(APP_DIR, filePath));
  if (relativePath === "layout.tsx") {
    return "/";
  }

  return normalizeRoute(`/${relativePath.replace(/\/layout\.tsx$/, "")}`);
}

function titleCase(segment) {
  return segment
    .replace(/[\[\]]/g, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelFromRoute(route) {
  if (route === "/") {
    return "Home";
  }

  return route
    .split("/")
    .filter(Boolean)
    .map((segment) => titleCase(segment))
    .join(" / ");
}

function routeGroup(route) {
  if (route === "/" || route === "/about" || route === "/partner" || route === "/owner-benefits" || route === "/owner-experience" || route === "/list-equipment") {
    return "public";
  }

  if (
    route.startsWith("/rent-equipment") ||
    route.startsWith("/models") ||
    route.startsWith("/categories") ||
    route.startsWith("/catalog") ||
    route.startsWith("/equipment") ||
    route.startsWith("/booking") ||
    route.startsWith("/locations")
  ) {
    return "discovery";
  }

  if (
    route.startsWith("/login") ||
    route.startsWith("/register") ||
    route.startsWith("/forgot-password") ||
    route.startsWith("/complete-profile") ||
    route.startsWith("/verify-contact") ||
    route.startsWith("/profile-selection")
  ) {
    return "auth";
  }

  if (route.startsWith("/owner-profile") || route.startsWith("/owner-registration")) {
    return "owner";
  }

  if (route.startsWith("/renter-profile")) {
    return "renter";
  }

  if (route.startsWith("/support") || route.startsWith("/faq") || route.startsWith("/legal") || route.startsWith("/trust-safety") || route.startsWith("/feedback")) {
    return "support";
  }

  return "public";
}

function componentIdFromName(name) {
  return `component:${name}`;
}

function addOrMergeNode(nodeMap, node) {
  const existing = nodeMap.get(node.id);
  if (!existing) {
    nodeMap.set(node.id, {
      ...node,
      files: node.files ? [...node.files] : [],
      notes: node.notes ? [...node.notes] : []
    });
    return;
  }

  const files = new Set([...(existing.files || []), ...(node.files || [])]);
  const notes = new Set([...(existing.notes || []), ...(node.notes || [])]);

  nodeMap.set(node.id, {
    ...existing,
    ...node,
    files: [...files],
    notes: [...notes]
  });
}

function addOrMergeEdge(edgeMap, edge) {
  const edgeKey = `${edge.source}|${edge.target}|${edge.type}|${edge.label || ""}`;
  const existing = edgeMap.get(edgeKey);
  if (!existing) {
    edgeMap.set(edgeKey, {
      ...edge,
      origins: edge.origins ? [...edge.origins] : []
    });
    return;
  }

  const originKey = (origin) => `${origin.file}:${origin.line}:${origin.raw}`;
  const mergedOrigins = [...(existing.origins || [])];
  const seenOriginKeys = new Set(mergedOrigins.map(originKey));

  for (const origin of edge.origins || []) {
    const key = originKey(origin);
    if (!seenOriginKeys.has(key)) {
      mergedOrigins.push(origin);
      seenOriginKeys.add(key);
    }
  }

  edgeMap.set(edgeKey, {
    ...existing,
    description: existing.description || edge.description || "",
    origins: mergedOrigins
  });
}

function lineNumberFromIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

function isAssetLikePath(target) {
  return SKIP_INTERNAL_PREFIXES.some((prefix) => target.startsWith(prefix)) ||
    SKIP_INTERNAL_SUFFIXES.some((suffix) => target.toLowerCase().endsWith(suffix));
}

function sanitizeTemplateValue(rawValue) {
  return rawValue
    .replace(/\$\{window\.location\.origin\}/g, "")
    .replace(/\$\{window\.location\.protocol\}/g, "")
    .replace(/\$\{window\.location\.host\}/g, "")
    .replace(/\$\{window\.location\.hostname\}/g, "")
    .replace(/\$\{[^}]+\}/g, "{dynamic}")
    .trim();
}

function classifyTarget(rawValue, routeSet) {
  if (!rawValue) {
    return null;
  }

  const trimmed = sanitizeTemplateValue(rawValue);

  if (!trimmed) {
    return null;
  }

  if (trimmed === "#") {
    return {
      type: "placeholder",
      node: {
        id: "missing:#",
        label: "Placeholder Target (#)",
        type: "missing-route",
        group: "missing",
        status: "placeholder",
        target: "#"
      },
      targetId: "missing:#",
      targetLabel: "#"
    };
  }

  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:") || trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    const isPlaceholderExternal =
      trimmed === "tel:+" ||
      trimmed === "mailto:" ||
      trimmed.endsWith("/#") ||
      trimmed.endsWith(":#");

    return {
      type: isPlaceholderExternal ? "placeholder" : "external-link",
      node: {
        id: `external:${trimmed}`,
        label: trimmed.replace(/^mailto:/, "Email: ").replace(/^tel:/, "Call: "),
        type: "external-destination",
        group: "external",
        status: isPlaceholderExternal ? "placeholder" : "external",
        target: trimmed
      },
      targetId: `external:${trimmed}`,
      targetLabel: trimmed
    };
  }

  if (!trimmed.startsWith("/")) {
    return null;
  }

  if (isAssetLikePath(trimmed)) {
    return null;
  }

  const normalizedPath = normalizeRoute(trimmed);
  const isMissing = !routeSet.has(normalizedPath);

  return {
    type: "internal-link",
    node: isMissing
      ? {
          id: `missing:${normalizedPath}`,
          label: labelFromRoute(normalizedPath),
          type: "missing-route",
          group: "missing",
          status: "missing",
          route: normalizedPath
        }
      : null,
    targetId: isMissing ? `missing:${normalizedPath}` : `route:${normalizedPath}`,
    targetLabel: normalizedPath
  };
}

function originRecord(filePath, line, rawValue, context) {
  return {
    file: toPosix(path.relative(ROOT_DIR, filePath)),
    line,
    raw: rawValue,
    context
  };
}

function extractRouteCandidates(text) {
  const candidates = [];
  const linePatterns = [
    { regex: /\b(?:href|path|url)\s*:\s*"([^"]+)"/g, context: "object-property" },
    { regex: /\b(?:href|path|url)\s*:\s*'([^']+)'/g, context: "object-property" },
    { regex: /\b(?:href|path|url)\s*:\s*`([^`]+)`/g, context: "object-property" },
    { regex: /href\s*=\s*"([^"]+)"/g, context: "href-attribute" },
    { regex: /href\s*=\s*'([^']+)'/g, context: "href-attribute" },
    { regex: /href\s*=\s*\{\s*`([^`]+)`\s*\}/g, context: "href-attribute" },
    { regex: /(router\.(?:push|replace))\(\s*"([^"]+)"/g, context: "router-navigation" },
    { regex: /(router\.(?:push|replace))\(\s*'([^']+)'/g, context: "router-navigation" },
    { regex: /(router\.(?:push|replace))\(\s*`([^`]+)`/g, context: "router-navigation" },
    { regex: /window\.location\.href\s*=\s*"([^"]+)"/g, context: "window-location" },
    { regex: /window\.location\.href\s*=\s*'([^']+)'/g, context: "window-location" },
    { regex: /window\.location\.href\s*=\s*`([^`]+)`/g, context: "window-location" }
  ];

  for (const pattern of linePatterns) {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const rawValue = match[2] || match[1];
      candidates.push({
        rawValue,
        line: lineNumberFromIndex(text, match.index),
        context: pattern.context
      });
    }
  }

  const navContexts = [
    { regex: /createOAuth2Session\(([\s\S]{0,300}?)\)/g, context: "oauth-return" },
    { regex: /router\.(?:push|replace)\(([\s\S]{0,180}?)\)/g, context: "router-navigation" },
    { regex: /window\.location\.href\s*=\s*([\s\S]{0,120}?)[;\n]/g, context: "window-location" }
  ];

  for (const navContext of navContexts) {
    let match;
    while ((match = navContext.regex.exec(text)) !== null) {
      const block = match[1] || "";
      const blockLine = lineNumberFromIndex(text, match.index);
      const quoteRegex = /["'`]([^"'`]+)["'`]/g;
      let quoteMatch;
      while ((quoteMatch = quoteRegex.exec(block)) !== null) {
        const rawValue = quoteMatch[1];
        candidates.push({
          rawValue,
          line: blockLine,
          context: navContext.context
        });
      }
    }
  }

  const unique = new Map();
  for (const candidate of candidates) {
    const key = `${candidate.rawValue}|${candidate.line}|${candidate.context}`;
    unique.set(key, candidate);
  }

  return [...unique.values()];
}

function componentImportsFromFile(text) {
  const imports = new Set();
  const importRegex = /from\s+["']@\/components\/([^"']+)["']/g;
  let match;

  while ((match = importRegex.exec(text)) !== null) {
    const target = match[1].split("/").pop()?.replace(/\.(tsx|ts|jsx|js)$/, "");
    if (target && RELEVANT_COMPONENTS.has(target)) {
      imports.add(target);
    }
  }

  return [...imports];
}

function defaultBaseUrl() {
  if (fs.existsSync(TUNNEL_LOG_FILE)) {
    const content = readFile(TUNNEL_LOG_FILE).trim();
    const urlMatch = content.match(/https:\/\/[^\s]+/);
    if (urlMatch) {
      return urlMatch[0];
    }
  }

  return "http://localhost:3000";
}

const pageFiles = walk(APP_DIR).filter((filePath) => {
  const isPageFile = toPosix(filePath).endsWith("/page.tsx") || toPosix(path.relative(ROOT_DIR, filePath)) === "app/page.tsx";
  return isPageFile && !isLegacyRouteFile(filePath);
});
const layoutFiles = walk(APP_DIR).filter((filePath) => {
  const isLayoutFile = toPosix(filePath).endsWith("/layout.tsx") || toPosix(path.relative(ROOT_DIR, filePath)) === "app/layout.tsx";
  return isLayoutFile && !isLegacyRouteFile(filePath);
});
const scanFiles = [...walk(APP_DIR), ...walk(COMPONENTS_DIR), ...walk(LIB_DIR)].filter(
  (filePath) => /\.(ts|tsx|js|jsx)$/.test(filePath) && (!filePath.startsWith(APP_DIR) || !isLegacyRouteFile(filePath))
);
const routeSet = new Set(pageFiles.map(routeFromPageFile));

const nodes = new Map();
const edges = new Map();

for (const pageFile of pageFiles) {
  const route = routeFromPageFile(pageFile);
  addOrMergeNode(nodes, {
    id: `route:${route}`,
    type: "page",
    group: routeGroup(route),
    label: labelFromRoute(route),
    route,
    status: "implemented",
    files: [toPosix(path.relative(ROOT_DIR, pageFile))]
  });
}

for (const annotationNode of annotations.extraNodes || []) {
  addOrMergeNode(nodes, annotationNode);
}

for (const layoutFile of layoutFiles) {
  const scopeRoute = scopeFromLayoutFile(layoutFile);
  if (scopeRoute === "/") {
    continue;
  }

  addOrMergeNode(nodes, {
    id: `layout:${scopeRoute}`,
    type: "flow-node",
    group: routeGroup(scopeRoute),
    label: `${labelFromRoute(scopeRoute)} Layout`,
    route: scopeRoute,
    status: "inferred",
    files: [toPosix(path.relative(ROOT_DIR, layoutFile))]
  });
}

for (const filePath of scanFiles) {
  const relativeFile = toPosix(path.relative(ROOT_DIR, filePath));
  const text = readFile(filePath);
  const isPageFile = (relativeFile.startsWith("app/") && relativeFile.endsWith("/page.tsx")) || relativeFile === "app/page.tsx";
  const isLayoutFile = (relativeFile.startsWith("app/") && relativeFile.endsWith("/layout.tsx")) || relativeFile === "app/layout.tsx";
  const isComponentFile = relativeFile.startsWith("components/");

  let sourceNodeId = null;
  let sourceNodeType = null;

  if (isPageFile) {
    const route = routeFromPageFile(filePath);
    sourceNodeId = `route:${route}`;
    sourceNodeType = "page";
  } else if (isLayoutFile) {
    const scopeRoute = scopeFromLayoutFile(filePath);
    if (scopeRoute !== "/") {
      sourceNodeId = `layout:${scopeRoute}`;
      sourceNodeType = "flow-node";
    }
  } else if (isComponentFile) {
    const componentName = path.basename(filePath).replace(/\.(tsx|ts|jsx|js)$/, "");
    sourceNodeId = componentIdFromName(componentName);
    sourceNodeType = "shared-component";
    addOrMergeNode(nodes, {
      id: sourceNodeId,
      type: "shared-component",
      group: "components",
      label: componentName,
      status: "shared",
      files: [relativeFile]
    });
  }

  if (!sourceNodeId) {
    continue;
  }

  const componentImports = componentImportsFromFile(text);

  if (sourceNodeType === "page") {
    for (const componentName of componentImports) {
      const componentId = componentIdFromName(componentName);
      addOrMergeNode(nodes, {
        id: componentId,
        type: "shared-component",
        group: "components",
        label: componentName,
        status: "shared",
        files: [`components/${componentName}.tsx`]
      });
      addOrMergeEdge(edges, {
        source: sourceNodeId,
        target: componentId,
        type: "surface",
        label: "renders",
        origins: [originRecord(filePath, 1, componentName, "component-import")]
      });
    }
  }

  if (sourceNodeType === "flow-node" && sourceNodeId.startsWith("layout:")) {
    for (const componentName of componentImports) {
      const componentId = componentIdFromName(componentName);
      addOrMergeNode(nodes, {
        id: componentId,
        type: "shared-component",
        group: "components",
        label: componentName,
        status: "shared",
        files: [`components/${componentName}.tsx`]
      });
      addOrMergeEdge(edges, {
        source: sourceNodeId,
        target: componentId,
        type: "surface",
        label: "composes",
        origins: [originRecord(filePath, 1, componentName, "layout-import")]
      });
    }

    const scopeRoute = sourceNodeId.replace(/^layout:/, "");
    const affectedRoutes = [...routeSet].filter((route) => route === scopeRoute || route.startsWith(`${scopeRoute}/`));

    for (const route of affectedRoutes) {
      addOrMergeEdge(edges, {
        source: `route:${route}`,
        target: sourceNodeId,
        type: "surface",
        label: "wrapped by layout",
        origins: [originRecord(filePath, 1, scopeRoute, "layout-scope")]
      });
    }
  }

  const candidates = extractRouteCandidates(text);

  for (const candidate of candidates) {
    const classified = classifyTarget(candidate.rawValue, routeSet);

    if (!classified) {
      continue;
    }

    if (classified.node) {
      addOrMergeNode(nodes, classified.node);
    }

    if (annotations.nodeNotes && annotations.nodeNotes[classified.targetId]) {
      addOrMergeNode(nodes, {
        id: classified.targetId,
        notes: [annotations.nodeNotes[classified.targetId]]
      });
    }

    let edgeType = classified.type;
    if (candidate.context === "router-navigation" || candidate.context === "window-location" || candidate.context === "oauth-return") {
      edgeType = edgeType === "placeholder" ? "placeholder" : "redirect";
    }

    addOrMergeEdge(edges, {
      source: sourceNodeId,
      target: classified.targetId,
      type: edgeType,
      label: classified.targetLabel,
      origins: [originRecord(filePath, candidate.line, candidate.rawValue, candidate.context)]
    });
  }
}

for (const extraEdge of annotations.extraEdges || []) {
  addOrMergeEdge(edges, {
    ...extraEdge,
    origins: [
      {
        file: "docs/site-map/annotations.js",
        line: 1,
        raw: extraEdge.label || extraEdge.target,
        context: "annotation"
      }
    ]
  });
}

for (const [nodeId, note] of Object.entries(annotations.nodeNotes || {})) {
  if (nodes.has(nodeId)) {
    addOrMergeNode(nodes, {
      id: nodeId,
      notes: [note]
    });
  }
}

const nodeList = [...nodes.values()]
  .map((node) => ({
    ...node,
    files: [...new Set(node.files || [])].sort(),
    notes: [...new Set(node.notes || [])].sort()
  }))
  .sort((left, right) => left.label.localeCompare(right.label));

const edgeList = [...edges.values()]
  .map((edge, index) => ({
    id: `edge-${index + 1}`,
    ...edge,
    origins: edge.origins.sort((left, right) => {
      if (left.file === right.file) {
        return left.line - right.line;
      }
      return left.file.localeCompare(right.file);
    })
  }))
  .sort((left, right) => {
    if (left.source === right.source) {
      return left.target.localeCompare(right.target);
    }
    return left.source.localeCompare(right.source);
  });

const data = {
  generatedAt: new Date().toISOString(),
  rootDir: toPosix(ROOT_DIR),
  defaultBaseUrl: defaultBaseUrl(),
  stats: {
    pages: nodeList.filter((node) => node.type === "page").length,
    components: nodeList.filter((node) => node.type === "shared-component").length,
    flowNodes: nodeList.filter((node) => node.type === "flow-node").length,
    missingRoutes: nodeList.filter((node) => node.type === "missing-route").length,
    externalDestinations: nodeList.filter((node) => node.type === "external-destination").length,
    edges: edgeList.length
  },
  nodes: nodeList,
  edges: edgeList
};

const serialized = JSON.stringify(data, null, 2);
const output = `(function (root) {\n  const data = ${serialized};\n\n  if (typeof module === "object" && module.exports) {\n    module.exports = data;\n  }\n\n  root.SITE_MAP_DATA = data;\n})(typeof globalThis !== "undefined" ? globalThis : this);\n`;

fs.writeFileSync(OUTPUT_FILE, output, "utf8");

console.log(`Generated site map data at ${toPosix(path.relative(ROOT_DIR, OUTPUT_FILE))}`);
console.log(
  `Pages: ${data.stats.pages} | Components: ${data.stats.components} | Flow nodes: ${data.stats.flowNodes} | Missing routes: ${data.stats.missingRoutes} | External: ${data.stats.externalDestinations} | Edges: ${data.stats.edges}`
);
