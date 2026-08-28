import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const distRoot = new URL("../dist/", import.meta.url);

function readDist(path: string): string {
  return readFileSync(new URL(path, distRoot), "utf8");
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
  assert.ok(existsSync(new URL("docs/getstarted/overview.md", distRoot)));
});
