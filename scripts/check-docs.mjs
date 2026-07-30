import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repositoryRoot = resolve(siteRoot, "..");

function walkReadmes(directory) {
  const results = [];
  for (const entry of readdirSync(directory)) {
    if (entry === "target" || entry === "node_modules" || entry.startsWith(".")) continue;
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) {
      results.push(...walkReadmes(path));
    } else if (entry === "README.md") {
      results.push(path);
    }
  }
  return results;
}

function sourceDocuments() {
  const systemDocs = readdirSync(join(repositoryRoot, "docs"))
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => join(repositoryRoot, "docs", entry));
  return [...systemDocs, ...walkReadmes(join(repositoryRoot, "zeta-rs"))];
}

function withoutInlineCode(line) {
  return line.replace(/`[^`]*`/g, "");
}

function checkDocument(path) {
  const failures = [];
  const lines = readFileSync(path, "utf8").replace(/\r\n/g, "\n").split("\n");
  let fenced = false;
  let topLevelHeadings = 0;
  let firstContentLine = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (!firstContentLine && trimmed) firstContentLine = { index, value: trimmed };
    if (/^```/.test(trimmed)) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    if (/^#\s+/.test(line)) topLevelHeadings += 1;

    const prose = withoutInlineCode(line);
    if (/<br\s*\/?>/i.test(prose)) {
      failures.push(`${index + 1}: 使用了 HTML 换行；请改成段落、列表或表格`);
    }
    if (!line.startsWith(">") && /\s{2,}$/.test(line)) {
      failures.push(`${index + 1}: 使用了 Markdown 强制换行；请改成真实语义结构`);
    }
  }

  if (!firstContentLine || !/^#\s+/.test(firstContentLine.value)) {
    failures.push(`${(firstContentLine?.index ?? 0) + 1}: 文档必须以一级标题开始`);
  }
  if (topLevelHeadings !== 1) {
    failures.push(`一级标题数量应为 1，当前为 ${topLevelHeadings}`);
  }

  return failures;
}

const failures = sourceDocuments().flatMap((path) =>
  checkDocument(path).map((failure) => `${relative(repositoryRoot, path)}:${failure}`),
);

if (failures.length) {
  console.error("文档规范检查失败：");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Checked ${sourceDocuments().length} documentation sources.`);
}
