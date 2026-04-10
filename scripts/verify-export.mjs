import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");
const filePattern = /\.(?:html|js|css)$/i;
const htmlCssMatchers = [
  { label: "/assets/", regex: /(["'(])\/assets\//g },
  { label: "/stitch-assets/", regex: /(["'(])\/stitch-assets\//g },
];

const jsMatchers = [
  { label: "src:/assets/", regex: /\bsrc\s*:\s*["']\/assets\//g },
  { label: "href:/assets/", regex: /\bhref\s*:\s*["']\/assets\//g },
  { label: "img:/assets/", regex: /\bimg\s*:\s*["']\/assets\//g },
  { label: "ownerImg:/assets/", regex: /\bownerImg\s*:\s*["']\/assets\//g },
  { label: "src:/stitch-assets/", regex: /\bsrc\s*:\s*["']\/stitch-assets\//g },
  { label: "href:/stitch-assets/", regex: /\bhref\s*:\s*["']\/stitch-assets\//g },
];

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }

    if (filePattern.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function toRelative(fullPath) {
  return path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
}

async function main() {
  const files = await collectFiles(outDir);
  const failures = [];

  for (const file of files) {
    const content = await readFile(file, "utf8");
    const isJs = file.endsWith(".js");
    const matchers = isJs ? jsMatchers : htmlCssMatchers;

    for (const matcher of matchers) {
      if (matcher.regex.test(content)) {
        failures.push(`${toRelative(file)} still contains raw ${matcher.label} references`);
      }
    }
  }

  if (failures.length > 0) {
    console.error("Export verification failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Export verification passed.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
