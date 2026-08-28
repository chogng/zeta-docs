const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const DIST_ROOT = path.resolve(__dirname, "..", "dist");

function readDist(filePath) {
  return fs.readFileSync(path.join(DIST_ROOT, filePath), "utf8");
}

test("builds a Docsify entry point and generated navigation", () => {
  const index = readDist("index.html");
  const sidebar = readDist("_sidebar.md");
  const navbar = readDist("_navbar.md");

  assert.match(index, /id="app"/);
  assert.match(index, /docsify@4\.13\.1\/lib\/docsify\.min\.js/);
  assert.match(index, /loadSidebar: true/);
  assert.match(sidebar, /\*\*开始使用\*\*/);
  assert.match(sidebar, /Zeta 概览/);
  assert.match(navbar, /GitHub/);
  assert.ok(fs.existsSync(path.join(DIST_ROOT, "docs", "getstarted", "overview.md")));
  assert.ok(fs.existsSync(path.join(DIST_ROOT, "favicon.svg")));
});
