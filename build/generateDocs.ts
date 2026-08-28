import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsDirectory = join(repositoryRoot, "docs");
const outputPath = join(repositoryRoot, ".build", "docs", "generatedDocs.ts");

interface TocGroup {
  name: string;
  area: string;
  topics: TocTopic[];
}

type TocTopic = [string, string] | [string, string, TocGroup];

interface DocumentHeading {
  depth: number;
  id: string;
  title: string;
}

interface DocumentMetadata {
  contentId: string;
  dateApproved: string;
  description: string;
  keywords: string[];
}

interface ParsedDocument extends DocumentMetadata {
  slug: string;
  sourcePath: string;
  title: string;
  navigationTitle: string;
  group: string;
  markdown: string;
  headings: DocumentHeading[];
  searchText: string;
}

interface TocEntry {
  label: string;
  slug: string;
  group: string;
}

function cleanInlineMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

function slugify(value: string): string {
  return cleanInlineMarkdown(value)
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseFrontmatter(raw: string): { metadata: DocumentMetadata; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error("missing YAML frontmatter");

  const values = new Map<string, string>();
  const keywords: string[] = [];
  let activeKey = "";
  for (const line of match[1].split("\n")) {
    const property = /^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/.exec(line);
    if (property) {
      activeKey = property[1];
      values.set(activeKey, property[2].trim());
      continue;
    }
    const listItem = /^\s+-\s+(.+)$/.exec(line);
    if (activeKey === "Keywords" && listItem) keywords.push(listItem[1].trim());
  }

  return {
    metadata: {
      contentId: values.get("ContentId") ?? "",
      dateApproved: values.get("DateApproved") ?? "",
      description: values.get("MetaDescription") ?? "",
      keywords,
    },
    body: match[2].trim(),
  };
}

function parseDocument(slug: string, group: string, navigationTitle: string): ParsedDocument {
  const path = join(docsDirectory, `${slug}.md`);
  const raw = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const { metadata, body } = parseFrontmatter(raw);
  const lines = body.split("\n");
  const titleLine = lines.findIndex((line) => /^#\s+/.test(line));
  if (titleLine < 0) throw new Error(`${relative(repositoryRoot, path)} has no H1 title`);

  const title = cleanInlineMarkdown(lines[titleLine].replace(/^#\s+/, ""));
  const bodyLines = lines.filter((_, index) => index !== titleLine);
  const usedIds = new Map<string, number>();
  const headings: DocumentHeading[] = [];

  for (const line of bodyLines) {
    const heading = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!heading) continue;
    const headingTitle = cleanInlineMarkdown(heading[2]);
    const baseId = slugify(headingTitle) || "section";
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);
    headings.push({ depth: heading[1].length, id: count ? `${baseId}-${count}` : baseId, title: headingTitle });
  }

  const markdown = bodyLines.join("\n").trim();
  const searchText = cleanInlineMarkdown(markdown)
    .replace(/[#>|()[\]{}]/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 12000);

  return {
    ...metadata,
    slug,
    sourcePath: relative(repositoryRoot, path).replaceAll("\\", "/"),
    title,
    navigationTitle,
    group,
    markdown,
    headings,
    searchText,
  };
}

function normalizeDocPath(value: string): string {
  const prefix = "/docs/";
  if (!value.startsWith(prefix)) throw new Error(`TOC path must start with ${prefix}: ${value}`);
  return value.slice(prefix.length).replace(/\.md$/, "");
}

function flattenTopics(topics: TocTopic[], group: string): TocEntry[] {
  return topics.flatMap((topic) => {
    const [label, path, nested] = topic;
    if (nested) return flattenTopics(nested.topics, group);
    if (!label || !path) throw new Error(`TOC topic in ${group} needs a label and path`);
    return [{ label, slug: normalizeDocPath(path), group }];
  });
}

function walkMarkdown(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return walkMarkdown(path);
    return entry.endsWith(".md") ? [relative(docsDirectory, path).replaceAll("\\", "/").replace(/\.md$/, "")] : [];
  });
}

const groups = JSON.parse(readFileSync(join(docsDirectory, "toc.json"), "utf8")) as TocGroup[];
const entries = groups.flatMap((group) => flattenTopics(group.topics, group.name));
const duplicateSlugs = entries.filter((entry, index) => entries.findIndex((candidate) => candidate.slug === entry.slug) !== index);
if (duplicateSlugs.length) throw new Error(`Duplicate TOC paths: ${duplicateSlugs.map((entry) => entry.slug).join(", ")}`);

const listedSlugs = new Set(entries.map((entry) => entry.slug));
const unlistedSlugs = walkMarkdown(docsDirectory).filter((slug) => !listedSlugs.has(slug));
if (unlistedSlugs.length) throw new Error(`Markdown pages missing from docs/toc.json: ${unlistedSlugs.join(", ")}`);

const documents = entries.map((entry) => parseDocument(entry.slug, entry.group, entry.label));
const orderedGroups = groups.map((group) => ({
  label: group.name,
  slugs: entries.filter((entry) => entry.group === group.name).map((entry) => entry.slug),
}));

const output = `// This file is generated by build/generateDocs.ts. Do not edit by hand.
import type { DocGroup, ZetaDoc } from "@/lib/types";

export const docs: ZetaDoc[] = ${JSON.stringify(documents, null, 2)};
export const docGroups: DocGroup[] = ${JSON.stringify(orderedGroups, null, 2)};
`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output);
console.log(`Generated ${documents.length} Zeta documentation pages.`);
