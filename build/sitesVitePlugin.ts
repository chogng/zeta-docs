import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

interface SitesVitePlugin {
  name: string;
  apply: "build";
  configResolved(config: { root: string }): void;
  closeBundle(): Promise<void>;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

export function sites(): SitesVitePlugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");
      const docsSource = resolve(root, "docs");
      const docsOutput = resolve(root, "dist", "docs");

      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });

      await cp(docsSource, docsOutput, { recursive: true });
      await cp(resolve(root, "_sidebar.md"), resolve(root, "dist", "_sidebar.md"));
      await cp(resolve(root, "_navbar.md"), resolve(root, "dist", "_navbar.md"));

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      }
      if (await exists(drizzleSource)) {
        await cp(drizzleSource, resolve(outputDirectory, "drizzle"), { recursive: true });
      }
    },
  };
}
