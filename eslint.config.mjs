import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.mjs"],
    rules: {
      "no-undef": "error",
      "no-unused-vars": "error",
    },
  },
  globalIgnores(["build/**", "dist/**", ".build/**", "node_modules/**", "**/*.ts"]),
]);
