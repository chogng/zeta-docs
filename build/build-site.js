// Copies the runtime-rendered Docsify site into a deployable dist directory.

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIRECTORY = path.join(ROOT, "dist");

fs.rmSync(OUTPUT_DIRECTORY, { recursive: true, force: true });
fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

for (const file of ["index.html", "_sidebar.md", "_navbar.md"]) {
  fs.copyFileSync(path.join(ROOT, file), path.join(OUTPUT_DIRECTORY, file));
}

for (const directory of ["docs", "public"]) {
  const source = path.join(ROOT, directory);
  const destination = directory === "public" ? OUTPUT_DIRECTORY : path.join(OUTPUT_DIRECTORY, directory);
  fs.cpSync(source, destination, { recursive: true });
}

const hostingConfig = path.join(ROOT, ".openai", "hosting.json");
if (fs.existsSync(hostingConfig)) {
  const hostingOutput = path.join(OUTPUT_DIRECTORY, ".openai");
  fs.mkdirSync(hostingOutput, { recursive: true });
  fs.copyFileSync(hostingConfig, path.join(hostingOutput, "hosting.json"));
}

console.log("Built the Docsify site in dist/.");
