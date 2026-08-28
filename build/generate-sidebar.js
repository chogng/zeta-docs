// Generates Docsify navigation from docs/toc.json.
// Usage: node build/generate-sidebar.js

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DOCS_DIRECTORY = path.join(ROOT, "docs");

function normalizeDocPath(value) {
  if (!value.startsWith("/docs/")) throw new Error(`TOC path must start with /docs/: ${value}`);
  return value.slice("/docs/".length).replace(/\.md$/, "");
}

function renderTopics(topics, indent, listedSlugs) {
  let markdown = "";
  for (const topic of topics) {
    if (topic.length === 3 && topic[2] && typeof topic[2] === "object") {
      const subsection = topic[2];
      markdown += `${indent}- **${subsection.name}**\n`;
      markdown += renderTopics(subsection.topics, `${indent}  `, listedSlugs);
      continue;
    }

    const [title, rawPath] = topic;
    if (!title || !rawPath) throw new Error("Every TOC topic needs a title and path");
    const slug = normalizeDocPath(rawPath);
    listedSlugs.add(slug);
    markdown += `${indent}- [${title}](/docs/${slug}.md)\n`;
  }
  return markdown;
}

function walkMarkdown(directory) {
  return fs.readdirSync(directory).flatMap((entry) => {
    const filePath = path.join(directory, entry);
    if (fs.statSync(filePath).isDirectory()) return walkMarkdown(filePath);
    return entry.endsWith(".md")
      ? [path.relative(DOCS_DIRECTORY, filePath).replaceAll("\\", "/").replace(/\.md$/, "")]
      : [];
  });
}

function buildSidebar() {
  const groups = JSON.parse(fs.readFileSync(path.join(DOCS_DIRECTORY, "toc.json"), "utf8"));
  const listedSlugs = new Set();
  let sidebar = "";

  for (const group of groups) {
    sidebar += `- **${group.name}**\n`;
    sidebar += renderTopics(group.topics, "  ", listedSlugs);
  }

  for (const slug of listedSlugs) {
    const sourcePath = path.join(DOCS_DIRECTORY, `${slug}.md`);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`TOC page does not exist: ${path.relative(ROOT, sourcePath)}`);
    }
  }

  const unlistedSlugs = walkMarkdown(DOCS_DIRECTORY).filter((slug) => !listedSlugs.has(slug));
  if (unlistedSlugs.length) {
    throw new Error(`Markdown pages missing from docs/toc.json: ${unlistedSlugs.join(", ")}`);
  }

  fs.writeFileSync(path.join(ROOT, "_sidebar.md"), sidebar, "utf8");
  fs.writeFileSync(
    path.join(ROOT, "_navbar.md"),
    "* [文档](/docs/getstarted/overview.md)\n* [GitHub ↗](https://github.com/chogng/zeta-docs)\n",
    "utf8",
  );

  console.log(`Generated Docsify navigation for ${listedSlugs.size} documentation pages.`);
}

buildSidebar();
