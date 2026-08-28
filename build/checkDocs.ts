import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsDirectory = join(repositoryRoot, "docs");
const failures: string[] = [];
const contentIds = new Map<string, string>();

function walkMarkdown(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) return walkMarkdown(path);
    return entry.endsWith(".md") ? [path] : [];
  });
}

function checkPage(path: string): void {
  const sourcePath = relative(repositoryRoot, path).replaceAll("\\", "/");
  const source = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  const frontmatter = /^---\n([\s\S]*?)\n---\n([\s\S]+)$/.exec(source);
  if (!frontmatter) {
    failures.push(`${sourcePath}: missing YAML frontmatter`);
    return;
  }

  const metadata = frontmatter[1];
  const body = frontmatter[2];
  for (const field of ["ContentId", "DateApproved", "MetaDescription"]) {
    if (!new RegExp(`^${field}:\\s*\\S.+$`, "m").test(metadata)) failures.push(`${sourcePath}: missing ${field}`);
  }

  const contentId = /^ContentId:\s*(\S+)$/m.exec(metadata)?.[1];
  if (contentId) {
    const previous = contentIds.get(contentId);
    if (previous) failures.push(`${sourcePath}: ContentId duplicates ${previous}`);
    contentIds.set(contentId, sourcePath);
  }

  const description = /^MetaDescription:\s*(.+)$/m.exec(metadata)?.[1].trim() ?? "";
  if (description.length > 160) failures.push(`${sourcePath}: MetaDescription exceeds 160 characters`);
  const dateApproved = /^DateApproved:\s*(.+)$/m.exec(metadata)?.[1].trim() ?? "";
  if (dateApproved && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateApproved)) failures.push(`${sourcePath}: DateApproved must use M/D/YYYY`);

  const headings = body.match(/^#\s+.+$/gm) ?? [];
  if (headings.length !== 1) failures.push(`${sourcePath}: expected exactly one H1, found ${headings.length}`);
  if (!/^#\s+.+\n\n\S/m.test(body)) failures.push(`${sourcePath}: add a direct introductory paragraph after the H1`);
  if (!/^##\s+.+$/m.test(body)) failures.push(`${sourcePath}: add at least one H2 section`);

  for (const link of body.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const target = link[1].split("#", 1)[0];
    if (!target || /^[a-z][a-z\d+.-]*:/i.test(target)) continue;
    const localPath = target.startsWith("/docs/")
      ? join(repositoryRoot, `${target.slice(1).replace(/\.md$/, "")}.md`)
      : resolve(dirname(path), target);
    if (!existsSync(localPath)) failures.push(`${sourcePath}: broken local link ${target}`);
  }
}

const pages = walkMarkdown(docsDirectory);
for (const path of pages) checkPage(path);

try {
  await import(new URL("./generateDocs.ts", import.meta.url).href);
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Checked ${pages.length} documentation pages.`);
}
