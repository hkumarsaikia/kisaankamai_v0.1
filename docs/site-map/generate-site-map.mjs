#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..", "..");
const APP_DIR = path.join(ROOT_DIR, "app");

const HTML_OUTPUT = path.join(__dirname, "index.html");
const JSON_OUTPUT = path.join(__dirname, "site-map-data.json");
const CSS_OUTPUT = "./styles.css";

const SHARED_COMPONENTS = [
  "Header",
  "Footer",
  "OwnerSidebar",
  "OwnerTopBar",
  "RenterSidebar",
  "RenterTopBar",
  "LanguageToggle",
  "ThemeToggle",
  "MapComponent",
  "LazyMap",
];

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function walk(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const results = [];

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

function normalizeRoute(route) {
  if (!route || route === "/") return "/";
  const clean = route.split("#")[0].split("?")[0].replace(/\/+$/, "");
  return clean || "/";
}

function resolveInternalPath(raw, existingRoutes) {
  const normalized = normalizeRoute(raw);
  if (existingRoutes.has(normalized)) {
    return normalized;
  }

  if (normalized.includes("${")) {
    if (normalized.startsWith("/equipment/") && existingRoutes.has("/equipment/[id]")) {
      return "/equipment/[id]";
    }

    if (normalized.startsWith("/list-equipment") && existingRoutes.has("/list-equipment")) {
      return "/list-equipment";
    }
  }

  return null;
}

function routeFromPageFile(filePath) {
  const relative = toPosix(path.relative(APP_DIR, filePath));
  if (relative === "page.tsx") return "/";
  return normalizeRoute(`/${relative.replace(/\/page\.tsx$/, "")}`);
}

function scopeFromLayoutFile(filePath) {
  const relative = toPosix(path.relative(APP_DIR, filePath));
  if (relative === "layout.tsx") return "/";
  return normalizeRoute(`/${relative.replace(/\/layout\.tsx$/, "")}`);
}

function titleCase(segment) {
  return segment
    .replace(/[\[\]]/g, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelFromRoute(route) {
  if (route === "/") return "Home";
  return route
    .split("/")
    .filter(Boolean)
    .map((segment) => titleCase(segment))
    .join(" / ");
}

function routeGroup(route) {
  if (
    route === "/" ||
    route === "/about" ||
    route === "/partner" ||
    route === "/owner-benefits" ||
    route === "/owner-experience" ||
    route === "/list-equipment" ||
    route === "/legal" ||
    route === "/trust-safety" ||
    route === "/faq"
  ) {
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

  if (route.startsWith("/support") || route.startsWith("/feedback")) {
    return "support";
  }

  return "public";
}

function extractSharedComponents(text) {
  const found = new Set();
  for (const component of SHARED_COMPONENTS) {
    const regex = new RegExp(`(?:<${component}\\b|from\\s+["']@\\/components\\/(?:[^"']*\\/)?${component}["'])`);
    if (regex.test(text)) {
      found.add(component);
    }
  }
  return [...found].sort();
}

function isAssetLike(target) {
  return (
    target.startsWith("/assets/") ||
    target.startsWith("/uploads/") ||
    /\.(png|jpe?g|webp|gif|svg|ico|css|js|json)$/i.test(target)
  );
}

function lineNumber(text, index) {
  return text.slice(0, index).split("\n").length;
}

function classifySurface(host) {
  if (!host || host === "localhost" || host === "127.0.0.1" || host === "[::1]") {
    return "localhost";
  }
  if (host.includes("trycloudflare.com")) return "public-tunnel";
  if (/^\d+\.\d+\.\d+\.\d+(?::\d+)?$/.test(host)) return "lan";
  return "custom-domain";
}

function normalizeTemplateForDisplay(value) {
  return value.replace(/\$\{[^}]+\}/g, "{dynamic}");
}

function stripTrailingWhitespace(value) {
  return value.replace(/[ \t]+$/gm, "");
}

function normalizeExternalDestination(raw) {
  if (raw.includes("${")) {
    if (raw.startsWith("tel:")) {
      return { href: "dynamic-tel", host: "tel" };
    }

    if (raw.startsWith("mailto:")) {
      return { href: "dynamic-mailto", host: "mailto" };
    }

    return { href: "dynamic-external-url", host: "dynamic" };
  }

  let host = "";
  try {
    host = new URL(raw).host;
  } catch {
    host = raw.startsWith("mailto:") ? "mailto" : raw.startsWith("tel:") ? "tel" : "";
  }

  return {
    href: normalizeTemplateForDisplay(raw),
    host,
  };
}

function extractDestinations(text, existingRoutes, filePath) {
  const internal = new Map();
  const external = new Map();
  const unresolved = new Map();
  const redirects = [];

  const patterns = [
    { regex: /href\s*=\s*["'`]([^"'`]+)["'`]/g, context: "href" },
    { regex: /href\s*=\s*\{\s*["'`]([^"'`]+)["'`]\s*\}/g, context: "href" },
    { regex: /router\.(?:push|replace)\(\s*["'`]([^"'`]+)["'`]/g, context: "router" },
    { regex: /redirect\(\s*["'`]([^"'`]+)["'`]/g, context: "redirect" },
    { regex: /window\.location(?:\.href)?\s*=\s*["'`]([^"'`]+)["'`]/g, context: "window" },
  ];

  for (const { regex, context } of patterns) {
    let match;
    while ((match = regex.exec(text)) !== null) {
      const raw = match[1].trim();
      if (!raw || raw === "#" || isAssetLike(raw)) continue;
      const rawForDisplay = normalizeTemplateForDisplay(raw);
      const origin = {
        file: toPosix(path.relative(ROOT_DIR, filePath)),
        line: lineNumber(text, match.index),
        raw: rawForDisplay,
        context,
      };

      if (/^(mailto:|tel:|https?:\/\/)/i.test(raw)) {
        const destination = normalizeExternalDestination(raw);
        if (!external.has(destination.href)) {
          external.set(destination.href, {
            href: destination.href,
            host: destination.host,
            accessSurface: classifySurface(destination.host),
            origins: [origin],
          });
        } else {
          external.get(destination.href).origins.push(origin);
        }
        continue;
      }

      if (!raw.startsWith("/")) continue;
      const resolvedPath = resolveInternalPath(raw, existingRoutes);
      const normalized = normalizeRoute(rawForDisplay);

      if (context !== "href") {
        redirects.push({ target: resolvedPath || normalized, context, origin });
      }

      if (resolvedPath) {
        if (!internal.has(resolvedPath)) internal.set(resolvedPath, { path: resolvedPath, origins: [origin] });
        else internal.get(resolvedPath).origins.push(origin);
      } else {
        if (!unresolved.has(normalized)) unresolved.set(normalized, { path: normalized, origins: [origin] });
        else unresolved.get(normalized).origins.push(origin);
      }
    }
  }

  return {
    internalDestinations: [...internal.values()].sort((a, b) => a.path.localeCompare(b.path)),
    externalDestinations: [...external.values()].sort((a, b) => a.href.localeCompare(b.href)),
    unresolvedDestinations: [...unresolved.values()].sort((a, b) => a.path.localeCompare(b.path)),
    redirects,
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function badge(text, kind = "default") {
  return `<span class="badge badge-${kind}">${escapeHtml(text)}</span>`;
}

function renderList(values, kind = "default", empty = "None") {
  if (!values.length) return `<p class="empty">${escapeHtml(empty)}</p>`;
  return `<div class="badge-row">${values.map((value) => badge(value, kind)).join("")}</div>`;
}

function renderLinkList(values, keyName, empty = "None") {
  if (!values.length) return `<p class="empty">${escapeHtml(empty)}</p>`;
  return `<ul class="link-list">${values
    .map((value) => `<li><code>${escapeHtml(value[keyName])}</code></li>`)
    .join("")}</ul>`;
}

const pageFiles = walk(APP_DIR).filter((filePath) => toPosix(filePath).endsWith("/page.tsx") || toPosix(path.relative(ROOT_DIR, filePath)) === "app/page.tsx");
const layoutFiles = walk(APP_DIR).filter((filePath) => toPosix(filePath).endsWith("/layout.tsx") || toPosix(path.relative(ROOT_DIR, filePath)) === "app/layout.tsx");

const existingRoutes = new Set(pageFiles.map(routeFromPageFile));
const layoutSurfaces = new Map();

for (const layoutFile of layoutFiles) {
  const scope = scopeFromLayoutFile(layoutFile);
  layoutSurfaces.set(scope, extractSharedComponents(read(layoutFile)));
}

const routes = pageFiles
  .map((pageFile) => {
    const route = routeFromPageFile(pageFile);
    const text = read(pageFile);
    const ownSurfaces = extractSharedComponents(text);
    const inherited = [...layoutSurfaces.entries()]
      .filter(([scope]) => scope !== "/" && (route === scope || route.startsWith(`${scope}/`)))
      .flatMap(([, surfaces]) => surfaces);
    const rootLayoutSurfaces = layoutSurfaces.get("/") || [];
    const surfaces = [...new Set([...rootLayoutSurfaces, ...inherited, ...ownSurfaces])].sort();
    const destinations = extractDestinations(text, existingRoutes, pageFile);

    return {
      path: route,
      label: labelFromRoute(route),
      group: routeGroup(route),
      sourceFile: toPosix(path.relative(ROOT_DIR, pageFile)),
      sharedSurfaces: surfaces,
      internalDestinations: destinations.internalDestinations,
      unresolvedDestinations: destinations.unresolvedDestinations,
      externalDestinations: destinations.externalDestinations,
      redirects: destinations.redirects,
    };
  })
  .sort((a, b) => a.path.localeCompare(b.path));

const routeGroups = ["public", "discovery", "auth", "owner", "renter", "support"];
const groupedRoutes = Object.fromEntries(routeGroups.map((group) => [group, routes.filter((route) => route.group === group)]));

const sharedSurfaceIndex = new Map();
for (const route of routes) {
  for (const surface of route.sharedSurfaces) {
    if (!sharedSurfaceIndex.has(surface)) sharedSurfaceIndex.set(surface, new Set());
    sharedSurfaceIndex.get(surface).add(route.path);
  }
}

const sharedSurfaces = [...sharedSurfaceIndex.entries()]
  .map(([surface, routePaths]) => ({
    surface,
    routePaths: [...routePaths].sort(),
  }))
  .sort((a, b) => a.surface.localeCompare(b.surface));

const unresolvedReferences = routes.flatMap((route) =>
  route.unresolvedDestinations.map((item) => ({
    route: route.path,
    path: item.path,
    sourceFile: route.sourceFile,
  }))
);

const externalDestinations = routes.flatMap((route) =>
  route.externalDestinations.map((item) => ({
    route: route.path,
    href: item.href,
    host: item.host,
    accessSurface: item.accessSurface,
  }))
);

const data = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalRoutes: routes.length,
    sharedSurfaces: sharedSurfaces.length,
    unresolvedInternalReferences: unresolvedReferences.length,
    externalDestinations: externalDestinations.length,
  },
  groupedRoutes,
  sharedSurfaces,
  unresolvedReferences,
  externalDestinations,
};

const sections = routeGroups
  .map((group) => {
    const items = groupedRoutes[group];
    return `
      <section class="section">
        <div class="section-heading">
          <h2>${escapeHtml(titleCase(group))}</h2>
          ${badge(`${items.length} routes`, "group")}
        </div>
        <div class="route-grid">
          ${items
            .map(
              (route) => `
                <article class="route-card">
                  <div class="route-header">
                    <div>
                      <h3><code>${escapeHtml(route.path)}</code></h3>
                      <p>${escapeHtml(route.label)}</p>
                    </div>
                    ${badge(group, "group")}
                  </div>
                  <dl class="meta-grid">
                    <div>
                      <dt>Source</dt>
                      <dd><code>${escapeHtml(route.sourceFile)}</code></dd>
                    </div>
                    <div>
                      <dt>Shared Surfaces</dt>
                      <dd>${renderList(route.sharedSurfaces, "surface", "No shared chrome detected")}</dd>
                    </div>
                    <div>
                      <dt>Internal Destinations</dt>
                      <dd>${renderLinkList(route.internalDestinations, "path", "No internal destinations")}</dd>
                    </div>
                    <div>
                      <dt>Programmatic Destinations</dt>
                      <dd>${renderLinkList(route.redirects, "target", "No redirect/programmatic destinations inferred")}</dd>
                    </div>
                    <div>
                      <dt>Unresolved References</dt>
                      <dd>${renderLinkList(route.unresolvedDestinations, "path", "No unresolved references")}</dd>
                    </div>
                    <div>
                      <dt>External Destinations</dt>
                      <dd>${renderLinkList(route.externalDestinations, "href", "No external destinations")}</dd>
                    </div>
                  </dl>
                </article>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  })
  .join("");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Kisan Kamai Static Site Map</title>
    <link rel="stylesheet" href="${CSS_OUTPUT}" />
  </head>
  <body>
    <main class="page-shell">
      <header class="hero">
        <p class="eyebrow">Documentation Artifact</p>
        <h1>Kisan Kamai Static Site Map</h1>
        <p class="lede">Generated route inventory for the current codebase. This static document replaces the old graph viewer and keeps route groups, shared surfaces, unresolved internal references, and external destinations visible without any interactive graph tooling.</p>
        <p class="timestamp">Generated: <code>${escapeHtml(data.generatedAt)}</code></p>
      </header>

      <section class="summary-grid">
        <article class="summary-card"><h2>Total Routes</h2><p>${data.summary.totalRoutes}</p></article>
        <article class="summary-card"><h2>Shared Surfaces</h2><p>${data.summary.sharedSurfaces}</p></article>
        <article class="summary-card"><h2>Unresolved Internal References</h2><p>${data.summary.unresolvedInternalReferences}</p></article>
        <article class="summary-card"><h2>External Destinations</h2><p>${data.summary.externalDestinations}</p></article>
      </section>

      ${sections}

      <section class="section">
        <div class="section-heading">
          <h2>Shared Surfaces</h2>
          ${badge(`${sharedSurfaces.length} surfaces`, "surface")}
        </div>
        <div class="route-grid">
          ${sharedSurfaces
            .map(
              (item) => `
                <article class="route-card">
                  <div class="route-header">
                    <h3>${escapeHtml(item.surface)}</h3>
                    ${badge(`${item.routePaths.length} routes`, "surface")}
                  </div>
                  ${renderList(item.routePaths, "route", "No routes")}
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <h2>Unresolved Internal References</h2>
          ${badge(`${unresolvedReferences.length} unresolved`, "warning")}
        </div>
        <div class="table-card">
          ${
            unresolvedReferences.length
              ? `<table><thead><tr><th>From Route</th><th>Missing Path</th><th>Source File</th></tr></thead><tbody>${unresolvedReferences
                  .map(
                    (item) =>
                      `<tr><td><code>${escapeHtml(item.route)}</code></td><td><code>${escapeHtml(item.path)}</code></td><td><code>${escapeHtml(item.sourceFile)}</code></td></tr>`
                  )
                  .join("")}</tbody></table>`
              : `<p class="empty">No unresolved internal references detected.</p>`
          }
        </div>
      </section>

      <section class="section">
        <div class="section-heading">
          <h2>External Destinations</h2>
          ${badge(`${externalDestinations.length} external links`, "external")}
        </div>
        <div class="table-card">
          ${
            externalDestinations.length
              ? `<table><thead><tr><th>From Route</th><th>Destination</th><th>Host</th><th>Surface</th></tr></thead><tbody>${externalDestinations
                  .map(
                    (item) =>
                      `<tr><td><code>${escapeHtml(item.route)}</code></td><td><code>${escapeHtml(item.href)}</code></td><td>${escapeHtml(item.host || "-")}</td><td>${escapeHtml(item.accessSurface)}</td></tr>`
                  )
                  .join("")}</tbody></table>`
              : `<p class="empty">No external destinations detected.</p>`
          }
        </div>
      </section>
    </main>
  </body>
</html>`;

fs.writeFileSync(JSON_OUTPUT, `${JSON.stringify(data, null, 2)}\n`, "utf8");
fs.writeFileSync(HTML_OUTPUT, `${stripTrailingWhitespace(html)}\n`, "utf8");

console.log(`Generated ${toPosix(path.relative(ROOT_DIR, JSON_OUTPUT))}`);
console.log(`Generated ${toPosix(path.relative(ROOT_DIR, HTML_OUTPUT))}`);
