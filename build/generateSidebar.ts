import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsDirectory = join(repositoryRoot, "docs");

type TocGroup = {
  name: string;
  area: string;
  topics: TocTopic[];
};

type TocTopic = [string, string] | [string, string, TocGroup];

function normalizeDocPath(value: string): string {
  if (!value.startsWith("/docs/")) throw new Error(`TOC path must start with /docs/: ${value}`);
  return value.slice("/docs/".length).replace(/\.md$/, "");
}

function renderTopics(topics: TocTopic[], indent: string, listedSlugs: Set<string>): string {
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

function walkMarkdown(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return walkMarkdown(path);
    return entry.endsWith(".md") ? [relative(docsDirectory, path).replaceAll("\\", "/").replace(/\.md$/, "")] : [];
  });
}

const groups = JSON.parse(readFileSync(join(docsDirectory, "toc.json"), "utf8")) as TocGroup[];
const listedSlugs = new Set<string>();
let sidebar = "";

for (const group of groups) {
  sidebar += `- **${group.name}**\n`;
  sidebar += renderTopics(group.topics, "  ", listedSlugs);
}

for (const slug of listedSlugs) {
  const sourcePath = join(docsDirectory, `${slug}.md`);
  if (!existsSync(sourcePath)) throw new Error(`TOC page does not exist: ${relative(repositoryRoot, sourcePath)}`);
}

const unlistedSlugs = walkMarkdown(docsDirectory).filter((slug) => !listedSlugs.has(slug));
if (unlistedSlugs.length) throw new Error(`Markdown pages missing from docs/toc.json: ${unlistedSlugs.join(", ")}`);

writeFileSync(join(repositoryRoot, "_sidebar.md"), sidebar, "utf8");
writeFileSync(
  join(repositoryRoot, "_navbar.md"),
  "* [文档](/docs/getstarted/overview.md)\n* [GitHub ↗](https://github.com/chogng/zeta-docs)\n",
  "utf8",
);

console.log(`Generated Docsify navigation for ${listedSlugs.size} documentation pages.`);
