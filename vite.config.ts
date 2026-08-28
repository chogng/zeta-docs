import type { UserConfig } from "vite";
import { sites } from "./build/sitesVitePlugin";

// macOS Seatbelt blocks FSEvents, so local previews need polling there.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const config: UserConfig = {
  server: isCodexSeatbeltSandbox
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
  plugins: [sites()],
};

export default config;
