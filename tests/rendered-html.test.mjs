import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/docs/architecture") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the documentation index", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Zeta 架构文档索引 · Zeta 文档<\/title>/i);
  assert.match(html, /Zeta 架构文档索引/);
  assert.match(html, /搜索文档/);
  assert.match(html, /本页内容/);
  assert.match(html, /由仓库中的 Markdown 自动生成/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("returns not found for an unknown documentation slug", async () => {
  const response = await render("/docs/not-a-real-page");
  assert.equal(response.status, 404);
});
