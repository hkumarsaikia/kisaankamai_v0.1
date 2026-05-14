import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function readSource(path) {
  return readFile(new URL(path, import.meta.url), "utf8");
}

test("Next native view transitions are enabled globally", async () => {
  const [nextConfig, template, wrapper, reactTypes] = await Promise.all([
    readSource("../next.config.mjs"),
    readSource("../app/template.tsx"),
    readSource("../components/PageViewTransition.tsx"),
    readSource("../react-canary.d.ts"),
  ]);

  assert.match(nextConfig, /experimental:\s*\{\s*viewTransition:\s*true/s);
  assert.match(template, /PageViewTransition/);
  assert.match(template, /const viewKey = pathname \|\| "root"/);
  assert.match(template, /viewKey=\{viewKey\}/);
  assert.match(template, /shouldBypassRouteShell/);
  assert.match(wrapper, /import\s+\{\s*ViewTransition,\s*type ReactNode\s*\}\s+from "react"/);
  assert.match(wrapper, /viewKey:\s*string/);
  assert.match(wrapper, /key=\{viewKey\}/);
  assert.match(wrapper, /"nav-forward":\s*"nav-forward"/);
  assert.match(wrapper, /"nav-back":\s*"nav-back"/);
  assert.match(wrapper, /default:\s*"fade-in"/);
  assert.match(wrapper, /default:\s*"fade-out"/);
  assert.match(wrapper, /default="none"/);
  assert.match(reactTypes, /react\/canary/);
});

test("shared app navigation tags links and programmatic routes with transition types", async () => {
  const [appLink, smoothRouter, transitionUtils] = await Promise.all([
    readSource("../components/AppLink.tsx"),
    readSource("../lib/client/useSmoothRouter.ts"),
    readSource("../lib/client/navigationTransition.ts"),
  ]);

  assert.match(transitionUtils, /export type NavigationTransitionType = "nav-forward" \| "nav-back"/);
  assert.match(transitionUtils, /getNavigationTransitionType/);
  assert.match(transitionUtils, /targetDepth < currentDepth/);
  assert.match(appLink, /transitionTypes/);
  assert.match(appLink, /useRouter/);
  assert.match(appLink, /getNavigationTransitionType\(href, pathname\)/);
  assert.match(appLink, /resolvedTransitionTypes/);
  assert.match(appLink, /event\.preventDefault\(\)/);
  assert.match(appLink, /addTransitionType\(inferredTransitionType\)/);
  assert.match(appLink, /router\.push\(href, \{ scroll \}\)/);
  assert.match(appLink, /router\.replace\(href, \{ scroll \}\)/);
  assert.match(smoothRouter, /addTransitionType/);
  assert.match(smoothRouter, /startTransition/);
  assert.match(smoothRouter, /router\.push\(href, options\)/);
  assert.match(smoothRouter, /router\.replace\(href, options\)/);
});

test("global CSS includes the React view-transition recipe and persistent chrome isolation", async () => {
  const [globals, header, footer, workspaceShell] = await Promise.all([
    readSource("../app/globals.css"),
    readSource("../components/Header.tsx"),
    readSource("../components/Footer.tsx"),
    readSource("../components/owner-profile/OwnerProfileWorkspaceShell.tsx"),
  ]);

  assert.match(globals, /--duration-exit:\s*150ms/);
  assert.match(globals, /@keyframes fade/);
  assert.match(globals, /@keyframes slide/);
  assert.match(globals, /@keyframes slide-y/);
  assert.match(globals, /::view-transition-old\(\.nav-forward\)/);
  assert.match(globals, /::view-transition-new\(\.nav-back\)/);
  assert.match(globals, /::view-transition-group\(\.morph\)/);
  assert.match(globals, /::view-transition-group\(\.text-morph\)/);
  assert.match(globals, /::view-transition-new\(\.scale-in\)/);
  assert.match(globals, /::view-transition-group\(persistent-header\)/);
  assert.match(globals, /::view-transition-old\(persistent-workspace-header\)/);
  assert.match(globals, /prefers-reduced-motion:\s*reduce[\s\S]*::view-transition-old\(\*\)/);
  assert.match(header, /viewTransitionName:\s*"persistent-header"/);
  assert.match(footer, /viewTransitionName:\s*"persistent-footer"/);
  assert.match(workspaceShell, /viewTransitionName:\s*"persistent-workspace-sidebar"/);
  assert.match(workspaceShell, /viewTransitionName:\s*"persistent-workspace-header"/);
  assert.match(workspaceShell, /viewTransitionName:\s*"persistent-workspace-mobile-nav"/);
});
